import React, {useState} from "react"
import { Context } from '../components/wrapper.js'
import { socketServer, loader, emojiApi } from "../shared/constants"
import io from 'socket.io-client'
import Layout from '../components/layout'
import { Link, navigate } from 'gatsby'

import '../styles/css/index.css'

function Index(){
	const {
		user, setUser, isLoading,
		socket, setSocket, connectedUsers,
		setConnectedUsers, setFriendIndex, token
	} = React.useContext(Context)

	React.useEffect(() => {
		if (!socket) { // make the connection
			const tempSocket = io(socketServer, {
				query: { uname: user.uname }
			})

			tempSocket.on('connect', () => setSocket(tempSocket))
			return () => tempSocket.off()
		} else {
			socket.on('connectedUsers', (d) => console.log('connectedUsers') & setConnectedUsers(d))
			socket.on('message', updatedUser => {
				console.log('message')
				setUser(updatedUser)
			})
			socket.on('entering', updatedUser => setUser(updatedUser))

			return () => socket.off()
		}
	}, [socket])


	const onChatClick = (f, i) => {
		setUser(currUser => {
			let messagesSentToMe = currUser.friends.find(u => u.uname === f.uname).messagesSentToMe
			messagesSentToMe = messagesSentToMe.filter(m => m.status = 'seen')
			return {...currUser, dontUpdate: false}
		})
		socket.emit('entering', f.uname, token)
		setFriendIndex(i)
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
			// number of unseen messages
			const unseenMsgCount = f.messagesSentToMe.filter(m => m.status === 'unseen').length

			// join all messages, sort in desending order and get the first item
			const latestMsg = [...f.messagesSentByMe, ...f.messagesSentToMe]
				.sort((m1, m2) => {
					return Date.parse(m2.sent_at) - Date.parse(m1.sent_at)
				})[0]

			if (latestMsg) {
				var { text, sent_at } = latestMsg

				var latestMsgDate = { // becomes a part of the function context because of var
					get date() {
						const currDay = new Date().getDate()
						const currMonth = new Date().getMonth()
						const currYear = new Date().getFullYear()

						const day = new Date(sent_at).getDate()
						const month = new Date(sent_at).getMonth()
						const monthName = new Date(sent_at).toLocaleString('default', { month: 'long' })
						const year = new Date(sent_at).getFullYear()

						if (currYear === year) {
							if (month === currMonth) {
								if (currDay === day) return 'Today'
								if (currDay - day === 1) return 'Yesterday'
								if (currDay - day < 7) return new Date(sent_at).toLocaleString('en', { weekday: 'long' })
								if (currDay - day >= 7 && currDay - day < 14) return 'Last Week'
							}
							else if (currMonth - month === 1) return 'Last Month'
							else return day + 'th ' + monthName
						} else {
							return `${day}th ${monthName}, ${year}`
						}

					},
					get hourAndMinute() {
						const hour = new Date(sent_at).getHours()
						let minute = new Date(sent_at).getMinutes()

						if (minute < 10) minute = '0' + minute
						let stringToReturn = ':' + minute

						if (hour > 12) stringToReturn = (hour - 12) + stringToReturn + ' pm'
						else stringToReturn = hour + stringToReturn + ' am'

						return stringToReturn
					}
				}
			}

			return (
				<div className='row-friend' onClick={() => onChatClick(f, i)}>
					<div className="img">img</div>

					<div>
						<h3> {f.uname} </h3>
						<p style={{opacity: !unseenMsgCount && 0}}> {unseenMsgCount} </p>
						<h5>{latestMsgDate && latestMsgDate.date}</h5>

						<div style={{flexBasis: '100%', height: 0}}></div>
						<h5> {text && text.length > 25 ? text.slice(0, 25) + '...' : text } </h5>
						<h5> {latestMsgDate && latestMsgDate.hourAndMinute} </h5>
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
