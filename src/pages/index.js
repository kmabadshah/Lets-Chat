import React, {useState} from "react"
import { Context } from '../components/wrapper.js'
import { socketServer, loader } from "../shared/constants"
import io from 'socket.io-client'
import Layout from '../components/layout'
import { Link, navigate } from 'gatsby'

import '../styles/css/index.css'

function Index(){
	const { user, setUser, isLoading, socket, setSocket,
		connectedUsers, setConnectedUsers, setFriendIndex, token
	} = React.useContext(Context)

	React.useEffect(() => {
		if (!socket) { // make the connection
			const tempSocket = io(socketServer, {
				query: { uname: user.uname }
			})

			tempSocket.on('connect', () => setSocket(tempSocket))
			return () => tempSocket.off()
		}
	}, [socket])

	const onChatClick = (f, i) => {
		setFriendIndex(i)
		socket.emit('wanna_chat', f.uname, token, (updatedUser) => {
			setUser(updatedUser)
		})
		navigate('/chat')
	}

	const getViewActiveFriends = () => {
		// if online and a friend of current user
		const finalArr = []

		connectedUsers.forEach(cu => {
			user.friends.map((f, i) => {
				cu.uname === f.uname && finalArr.push((() => {
					return (
						<button onClick={() => onChatClick(f, i)}>
							{f.image ? 'img' : f.uname.toUpperCase()[0]}
						</button>
					)
				})())
			})
		})

		return (
			<div className="row-active">
				{finalArr.length !== 0 ? finalArr :
				<h4>None of your friends are online now.</h4>}
			</div>
		)
	}

	const getViewFriends = () => {
		return user.friends.map((f, i) => {

			// join all messages, sort in desending order and get the first item
			const { text:latestMessage, sent_at } = [...f.messagesSentByMe, ...f.messagesSentToMe]
				.sort((m1, m2) => {
					return Date.parse(m2.sent_at) - Date.parse(m1.sent_at)
				})[0]

			if ()

				const latestMsgDate = {
					day: new Date(sent_at).getDate(),
					month: new Date(sent_at).toLocaleString('default', { month: 'long' }),
					get hourAndMinute() {
						const hour = new Date(sent_at).getHours()
						const minute = new Date(sent_at).getMinutes()
						let stringToReturn = ':' + minute

						if (hour > 12) stringToReturn = (hour - 12) + stringToReturn + ' pm'
						else stringToReturn = hour + stringToReturn + ' am'

						return stringToReturn
					}
				}

			return (
				<div className='row-friend' onClick={() => onChatClick(f, i)}>
					<div className="img">img</div>

					<div>
						<h3> {f.uname} </h3>
						<h5> {latestMessage} </h5>
					</div>

					<div>
						<h5> {latestMsgDate.day}th {latestMsgDate.month} </h5>
						<h5> {latestMsgDate.hourAndMinute} </h5>
					</div>
				</div>
			)
		})
	}

	return (
		<Layout>
			<div id='home'>
				{getViewActiveFriends()}
				{getViewFriends()}
			</div>
		</Layout>
	)
}
export default Index
