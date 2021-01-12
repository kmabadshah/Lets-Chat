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

	const getViewActiveFriends = () => {
		// if online and a friend of current user
		const finalArr = []

		connectedUsers.forEach(cu => {
			Array.from({ length: 15 }, (_, i) => {
				finalArr.push(
					<button>
						{i + 1}
					</button>
				)
			})

			// user.friends.map(f => {
			// 	cu.uname === f.uname && finalArr.push((() => {
			// 		return (
			// 			<button>
			// 				{f.image ? 'img' : f.uname.toUpperCase()[0]}
			// 			</button>
			// 		)
			// 	})())
			// })
		})

		return <div class="row-active">{finalArr}</div>
	}

	const getViewFriends = () => {
		return user.friends.map((f, i) => {
			return (
				<div className='row-friend'>
					{/* <p>{i+1} . {f.uname}</p> */}


					{/* <p>status: */}
					{/* 	{ connectedUsers.find(u => u.uname === f.uname) ? 'Online' : 'Offline' } */}
					{/* </p> */}

					{/* <button onClick={() => onChatClick(i)} */}
					{/* 	className='btn-chat' */}
					{/* >chat</button> */}


					<div className="img">img</div>

					<div>
						<h3>Jane Doe</h3>
						<h5>I am a rockster who</h5>
					</div>

					<div>
						<h5> 24th July </h5>
						<h5>10:30 pm</h5>
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



