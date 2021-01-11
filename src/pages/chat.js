import React, {useState} from "react"
import { Context } from '../components/wrapper'
import { Link } from 'gatsby'
import { useForm } from 'react-hook-form'

export default function Chat() {
	const { user, setUser, friendIndex,
		socket, token, connectedUsers, setConnectedUsers } = React.useContext(Context)
	const { register, handleSubmit } = useForm()
	const [friendOffline, setFriendOffline] = useState()
	const friend = user.friends[friendIndex]

	React.useEffect(() => {
		setFriendOffline(() => {
			return connectedUsers.find(u => u.uname === friend.uname) ? false : true
		})
	}, [connectedUsers])

	const onSubmit = (d) => {
		// send message and upate local user after response
		socket.emit('message', d.msg, friend.uname, token, (updatedUser) => {
			setUser(updatedUser)
		})
	}

	const getViewMessages = () => {
		const allViewMessages = []

		user.friends[friendIndex].messagesSentToMe.forEach(m => {
			allViewMessages.push({
				view: <p className='msg-target'>{m.text}</p>,
				sent_at: new Date(m.sent_at).getTime()
			})
		})

		user.friends[friendIndex].messagesSentByMe.forEach(m => {
			allViewMessages.push({
				view: <p className='msg-source'>{m.text}</p>,
				sent_at: new Date(m.sent_at).getTime()
			})
		})

		// sort by descending order according to sent_at
		// and return only the view for each message
		return allViewMessages.sort((m1, m2) => m1.sent_at - m2.sent_at).map(m => m.view)
	}

	return(
		<div id='chat'>
			<div id='top'>
				<Link to='/'>Back</Link>
				<h1>{friend.uname}</h1>
				<p>Status: { friendOffline ? 'Offline' : 'Online' }</p>
			</div>


			<div id='middle'>
				{getViewMessages()}
			</div>

			<form id='bottom' autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
				<input autoComplete='false' name='msg' ref={register({
					required: true
				})} />

				<input type="submit" value="Send" />
			</form>
		</div>
	)
}
