import React, {useState} from "react"
import { Context } from '../components/wrapper'
import { Link, navigate } from 'gatsby'
import { useForm } from 'react-hook-form'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faCheck } from '@fortawesome/free-solid-svg-icons'
import { faCheckCircle, faSmile, faClock } from '@fortawesome/free-regular-svg-icons'
import { Picker } from 'emoji-mart'

export default function Chat() {
	const { user, setUser, friendIndex,
		socket, token, connectedUsers, setConnectedUsers } = React.useContext(Context)
	const { register, handleSubmit, reset } = useForm()
	const [friendOffline, setFriendOffline] = useState()
	const [showPicker, setShowPicker] = useState(false)
	const friend = user.friends[friendIndex]
	const dummyRef = React.useRef()

	React.useEffect(() => {
		setFriendOffline(() => {
			return connectedUsers.find(u => u.uname === friend.uname) ? false : true
		})
	}, [connectedUsers])

	React.useLayoutEffect(() => {
		// scroll to message bottom
		dummyRef.current.scrollIntoView()
	}, [])

	const onSubmit = (d) => {
		// update the user with the new message
		// and a pending property inside the message
		const temp = {...user}
		temp.friends.find(f => f.uname === friend.uname).messagesSentByMe.push({
			text: d.msg,
			pending: true
		}); setUser(temp)

		// send message and upate local user after response
		socket.emit('message', d.msg, friend.uname, token, (updatedUser) => {
			setUser(updatedUser)
			// scroll to message bottom
		})

		dummyRef.current.scrollIntoView()
		reset()
	}

	const getViewMessages = () => {
		const allViewMessages = []

		// received messages
		user.friends[friendIndex].messagesSentToMe.forEach(m => {
			let date = getDateObj(m)

			allViewMessages.push({
				view: (
					<div className='msg-received-row'>
						<div>
							<p>{m.text}</p>
						</div>

						<div>
							<p>{date.day} {date.month}</p>
							<p>{date.hourAndMinute}</p>
						</div>
					</div>
				),
				sent_at: new Date(m.sent_at).getTime()
			})
		})

		// sent messages
		user.friends[friendIndex].messagesSentByMe.forEach(m => {
			let date = getDateObj(m)

			allViewMessages.push({
				view: (
					<div className='msg-sent-row'>
						{!date ? <div></div> : (
							<div>
								<p>{date.day} {date.month}</p>
								<p>{date.hourAndMinute}</p>
							</div>
						)}

						<div>
							<FontAwesomeIcon icon={m.pending ? faClock : faCheckCircle} className='check-circle' />
							<p>{m.text}</p>
						</div>
					</div>
				) ,
				sent_at: new Date(m.sent_at).getTime()
			})
		})

		// sort by descending order according to sent_at
		// and return only the view for each message
		return allViewMessages
			.sort((m1, m2) => m1.sent_at - m2.sent_at)
			.map(m => m.view)
	}


	return (
		<div id='chat'>
			<div id="top">
				<FontAwesomeIcon className='btn-back' onClick={() => navigate('/')} icon={faArrowLeft} />

				<h2>Jane Doe</h2>

			</div>

			<div id="middle">
				{getViewMessages()}

				{/* dummy div for scrolling and emoji */}
				<div ref={dummyRef}></div>

				{showPicker && <Picker style={{
					position: 'fixed',
					bottom: '5rem'
				}} />}

			</div>

			<form id='bottom' autoComplete='off' onSubmit={handleSubmit(onSubmit)}>

				<FontAwesomeIcon
					icon={faSmile}
					onClick={() => setShowPicker(!showPicker)} />

				<input autoComplete='false' name='msg' ref={register({
					required: true
				})} />

				<button type="submit">
					<FontAwesomeIcon icon={faCheck} />
				</button>
			</form>
		</div>
	)
}


function getDateObj(m) {
	return !m.sent_at ? null : {
		day: new Date(m.sent_at).getDate(),
		month: new Date(m.sent_at).toLocaleString('default', { month: 'long' }),
		get hourAndMinute() {
			const hour = new Date(m.sent_at).getHours()
			const minute = new Date(m.sent_at).getMinutes()

			let stringToReturn = ':'

			if (minute < 10) stringToReturn = stringToReturn + 0 + minute
			else stringToReturn += minute

			if (hour > 12) stringToReturn = (hour - 12) + stringToReturn + ' pm'
			else stringToReturn = hour + stringToReturn + ' am'

			return stringToReturn
		}
	}
}




// 1) change the loading spinner icon when sending message
// 2) change the loading spinner depending on pending state


