const app = require("express")(),
	http = require("http").createServer(app),
	io = require("socket.io")(http)

app.get("/", (req, res) => res.send("something"))


let connectedUsers = []

io.on("connection", (sc) => {
	// data sent from client
	const uname = sc.handshake.query.uname

	// check if already connected
	const connected = connectedUsers.find(user => user.uname === uname)
	if (!connected) connectedUsers.push({ uname, scId: sc.id  }); console.log(connectedUsers)

})

http.listen(3000, () => console.log("Listening to port 3000"))

