import React, {useState} from "react"
import { Context } from '../components/wrapper.js'
import { socketServer, loader } from "../shared/constants"
import io from 'socket.io-client'
import Layout from '../components/layout'
import { Link, navigate } from 'gatsby'

import '../styles/css/index.css'

function Index(){
	const { user, setUser, isLoading, socket, setSocket,
		connectedUsers, setConnectedUsers, setFriendIndex } = React.useContext(Context)

	React.useEffect(() => {
		if (!socket) { // make the connection
			const tempSocket = io(socketServer, {
				query: { uname: user.uname }
			})

			tempSocket.on('connect', () => setSocket(tempSocket))
			return () => tempSocket.off()
		}
	}, [socket])

	const onChatClick = (i) => {
		setFriendIndex(i)
		navigate('/chat')
	}

	const getViewFriends = () => {
		return user.friends.map((f, i) => {
			return (
				<div className='row-friend'>
					<p>{i+1} . {f.uname}</p>

					<p>status:
						{ connectedUsers.find(u => u.uname === f.uname) ? 'Online' : 'Offline' }
					</p>

					<button onClick={() => onChatClick(i)}
						className='btn-chat'
					>chat</button>
				</div>
			)
		})
	}

	return (
		<Layout>
			<div id='home'>
				{getViewFriends()}
			</div>
		</Layout>
	)
}
export default Index



