const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.get("/", (req, res) => res.send("something"))


let connectedUsers = []

io.on("connection", async (sc) => {
	const axios = require('axios')
	const qs = require('qs')
	const api = 'http://localhost:1337'
	const uname = sc.handshake.query.uname // data sent from client

	if (uname) {
		const connected = connectedUsers.find(user => user.uname === uname)

		if (!connected) connectedUsers.push({ uname, socketId: sc.id  })
		else { // remove old connection and insert new one
			connectedUsers = connectedUsers.filter(u => u.uname !== uname)
			connectedUsers.push({ uname, socketId: sc.id })
		}
	}

	io.emit('connectedUsers', connectedUsers) // notify about connected users

	sc.on('wanna_chat', async (funame, token, fn) => {
		try {
			// find the user with funame
			let res = await axios.get(api + '/chatters?' + qs.stringify({
				_where: { uname: funame }
			}), { headers: { Authorization: `Bearer ${token}` }})
			const data = res.data[0]
			const id = res.data[0].id

			const friend = data.friends.find(f => f.uname === uname)
			friend.messagesSentToMe.forEach((m, i) => {
				m.status = 'seen'
				friend.messagesSentToMe[i] = m
			})

			// update the user
			console.log(data)
			res = await axios.put(api + '/chatters/' + id, data, {
				headers: { Authorization: `Bearer ${token}` }
			})

			fn(res.data[0])
		} catch (err) { console.dir(err.response.data, {depth: null}) }
	})

	sc.on('disconnect', () => {
		// exclude user on disconnect
		connectedUsers = connectedUsers.filter(u => u.uname !== uname)

		io.emit('connectedUsers', connectedUsers) // notify about connected users
	})

	sc.on('error', (err) => {
		console.log(err)
	})

	sc.on('message', async (msg, targetUname, token, fn) => {
		try {
			// get the target user
			let res = await axios.get(api + '/chatters?' + qs.stringify({
				_where: { uname: targetUname }
			}), { headers: { Authorization: `Bearer ${token}` } })
			const targetUser = res.data[0]

			// get the source user
			res = await axios.get(api + '/chatters?' + qs.stringify({
				_where: { uname: uname }
			}), { headers: { Authorization: `Bearer ${token}` } })
			const sourceUser = res.data[0]




			// check if the source is already a friend, make a friend if not
			const sourceInTargetFriendsArr = targetUser.friends.find(f => f.uname === uname)

			if (!sourceInTargetFriendsArr) {
				targetUser.friends.push({
					uname: sourceUser.uname,
					messagesSentToMe: [],
					messagesSentByMe: [] })
			}

			// push the message to target and update
			targetUser.friends
				.find(f => f.uname === uname)
				.messagesSentToMe.push({ text: msg, sent_at: Date.now() })

			res = await axios.put(
				api + '/chatters/' + targetUser.id,
				targetUser,
				{ headers: { Authorization: `Bearer ${token}` } })
			const updatedTargetUser = res.data




			// check if the target is already a friend, make a friend if not
			const targetInSourceFriendsArr = sourceUser.friends.find(f => f.uname === targetUname)

			if (!targetInSourceFriendsArr) {
				sourceUser.friends.push({
					uname: targetUser.uname,
					messagesSentToMe: [],
					messagesSentByMe: [] })
			}

			// push the message to source and update
			sourceUser.friends
				.find(f => f.uname === targetUname)
				.messagesSentByMe.push({ text: msg, sent_at: Date.now() })

			res = await axios.put(
				api + '/chatters/' + sourceUser.id,
				sourceUser,
				{ headers: { Authorization: `Bearer ${token}` } })
			const updatedSourceUser = res.data

			// send to the source
			fn(updatedSourceUser)

			// send to the target if connected
			const targetInConnectedUsersArr = connectedUsers.find(u => u.uname === targetUname)

			if (targetInConnectedUsersArr) {
				io.to(targetInConnectedUsersArr.socketId).emit('message', updatedTargetUser)
			}

		} catch (err) {
			console.log(err)
		}
	})
})

http.listen(3000, () => console.log("Listening to port 3000"))








// big problem with the current setup
// sav the user message status on database for persistance
