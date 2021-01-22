/* global user */

import React, {useState} from "react"
import { Context } from '../components/wrapper'
import { Link, navigate } from 'gatsby'
import { emojiApi } from '../shared/constants'
import { useForm } from 'react-hook-form'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faCheck, faCheckCircle as fasCheckCircle } from '@fortawesome/free-solid-svg-icons'
import { faCheckCircle as farCheckCircle, faSmile, faClock } from '@fortawesome/free-regular-svg-icons'
import axios from 'axios'

export default function Chat() {
	// logic
	const { user, setUser, friendIndex,
		socket, token, connectedUsers, setConnectedUsers } = React.useContext(Context)
	const { register, handleSubmit, reset } = useForm()
	const [friendOffline, setFriendOffline] = useState()
	const [showPicker, setShowPicker] = useState(false)
	const [sending, setSending] = useState()
	const [emojis, setEmojis] = useState([])
	const dummyRef = React.useRef()
	const friend = user.friends[friendIndex]
	let emojiColumns = ''; Array.from({length: Math.ceil(emojis.length/4)}, () => emojiColumns += '10% ')


	React.useEffect(() => {
		setFriendOffline(() => {
			return connectedUsers.find(u => u.uname === friend.uname) ? false : true
		})
	}, [connectedUsers])

	React.useEffect(() => {
		axios.get(emojiApi).then(d => setEmojis(d.data)).catch(err => console.log(err))

		socket.on('connectedUsers', (d) => setConnectedUsers(d))
		socket.on('message', updatedUser => {
			setUser(currUser => {
				let messagesSentToMe = currUser.friends.find(f => f.uname === friend.uname).messagesSentToMe
				messagesSentToMe = messagesSentToMe.filter(m => m.status = 'seen')
				return {...currUser, dontUpdate: false}
			})
			setUser(updatedUser)
			dummyRef.current.scrollIntoView()
		})
		socket.on('entering', updatedUser => setUser(updatedUser))

		return () => {
			socket.emit('leaving')
			socket.off()
		}
	}, [])

	React.useLayoutEffect(() => {
		// scroll to message bottom
		dummyRef.current.scrollIntoView()
	}, [])

	const onSubmit = (d) => {
		setSending(true)
		setUser(currUser => {
			currUser.friends.find(f => f.uname === friend.uname).messagesSentByMe.push({
				text: d.msg, sent_at: Date.now(), status: 'sending'
			})

			return { ...currUser, dontUpdate: true }
		})


		// send message and upate local user after response
		socket.emit('message', d.msg, friend.uname, token, (updatedUser) => {
			setUser(updatedUser)
			setSending(false)
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
							<p>{date && date.date}</p>
							<p>{date && date.hourAndMinute}</p>
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
								<p>{date && date.date}</p>
								<p>{date && date.hourAndMinute}</p>
							</div>
						)}

						<div>
							<FontAwesomeIcon icon={(() => {
								switch (m.status) {
									case 'sending': return faClock
									case 'sent': return farCheckCircle
									case 'seen': return fasCheckCircle
								}
							})()} className='check-circle' />
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













	// ui
	return (
		<div id='chat'>
			<div id="top">
				<FontAwesomeIcon className='btn-back' onClick={() => navigate('/')} icon={faArrowLeft} />

				<h2>{ friend.uname }</h2>

			</div>

			<div id="middle">
				{getViewMessages()}

				{/* dummy div for scrolling and emoji */}
				<div ref={dummyRef}></div>
			</div>

			<form id='bottom'
				autoComplete='off'
				onSubmit={handleSubmit(onSubmit)}
				style={{
					pointerEvents: sending ? 'none' : 'auto',
					backgroundColor: sending && '#999',
					borderColor: sending && '#999'
				}}
			>
				<FontAwesomeIcon
					icon={faSmile}
					onClick={() => setShowPicker(!showPicker)} />

				<input autoComplete='false'
					name='msg'
					disabled={sending}
					ref={register({ required: true })} />

				<button type="submit">
					<FontAwesomeIcon icon={faCheck} />
				</button>

			</form>

			{showPicker &&
				<div id='picker' style={{gridTemplateColumns: emojiColumns}}>
					{emojis.map(e => <div>{e.character}</div>)}
				</div>
			}
		</div>
	)













	// utilities
	function getDateObj(m) {
		return !m.sent_at ? null : {
			get date() {
				const currDay = new Date().getDate()
				const currMonth = new Date().getMonth()
				const currYear = new Date().getFullYear()

				const day = new Date(m.sent_at).getDate()
				const month = new Date(m.sent_at).getMonth()
				const monthName = new Date(m.sent_at).toLocaleString('default', { month: 'long' })
				const year = new Date(m.sent_at).getFullYear()

				if (currYear ===  year) {
					if (month === currMonth) {
						if (currDay === day) return 'Today'
						if (currDay - day === 1) return 'Yesterday'
						if (currDay - day < 7) return new Date(m.sent_at).toLocaleString('en', { weekday: 'long' })
						if (currDay - day >= 7 && currDay - day < 14) return 'Last Week'
					}
					else if (currMonth - month === 1) return 'Last Month'
					else return day + 'th ' + monthName
				} else {
					return `${day}th ${monthName}, ${year}`
				}

			},
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
}










