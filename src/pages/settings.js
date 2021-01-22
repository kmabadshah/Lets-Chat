import React, {useState} from "react"
import Layout from '../components/layout'
import { Context } from '../components/wrapper'
import { api, loader } from '../shared/constants'
import { navigate } from 'gatsby'
import { useForm } from 'react-hook-form'
import { ErrorMessage } from '@hookform/error-message'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserPlus, faPen, faLongArrowAltRight } from '@fortawesome/free-solid-svg-icons'
// import { faCheckCircle, faSmile, faClock } from '@fortawesome/free-regular-svg-icons'

function Settings(){
	const [editing, setEditing] = React.useState()
	const { user, setUser, token, socket, setConnectedUsers } = React.useContext(Context)
	const { handleSubmit, reset, errors, setError, register } = useForm()
	const blurStyle = {
		filter: editing && 'blur(5px)',
		pointerEvents: editing && 'none'
	}

	React.useEffect(() => {
		socket.on('connectedUsers', (d) => setConnectedUsers(d))
		socket.on('message', updatedUser => {
			setUser(updatedUser)
		})
		socket.on('entering', updatedUser => setUser(updatedUser))

		return () => socket.off()
	}, [])

	const onAddFriend = async (d) => {
		const axios = await import('axios')
		const qs = await import('qs')

		// check if already friend
		const alreadyFriend = user.friends.find(f => f.uname === d.uname)
		// check if friend exists as a user
		const res = await axios.get(api + '/chatters?' + qs.stringify({
			_where: { uname: d.uname }
		}), { headers: { Authorization: `Bearer ${token}` } })

		if (!res.data[0]) {
			setError('uname', { type: 'random', message: `User doesn't exist` })
		} else if (alreadyFriend) {
			setError('uname', { type: 'random', message: `He is already your friend` })
		} else if (d.uname === user.uname) {
			setError('uname', { type: 'random', message: `That's your own username` })
		} else {
			setUser(currentUser => {
				currentUser.friends.push({ uname: d.uname, messagesSentToMe: [], messagesSentByMe: [] })
				return { ...currentUser, dontUpdate: false }
			})


			setEditing(false)
		}

	}

	const onChangeUname = async (d) => {
		const axios = await import('axios')
		const qs = await import('qs')

		// check if the uname exists
		const res = await axios.get(api + '/chatters?' + qs.stringify({
			_where: { uname: d.uname }
		}), { headers: { Authorization: `Bearer ${token}` } })

		if (res.data[0]) {
			setError('uname', { type: 'random', message: `Please choose a different username` })
		} else {
			setUser(currentUser => {
				return { ...currentUser, uname: d.uname, dontUpdate: false }
			})

			setEditing(false)
		}

	}

	const onChangePass = (d) => {
		if (d.current_pass !== user.pass) {
			setError('current_pass', { type: 'random', message: `Invalid password` })
		} else if (d.new_pass !== d.conf_pass){
			setError('conf_pass', { type: 'random', message: `Passwords don't match` })
		} else {
			setUser(currentUser => {
				return { ...currentUser, pass: d.new_pass, dontUpdate: false }
			})

			setEditing(false)
		}

	}

	const logOut = () => {
		// remove data from cache
		localStorage.removeItem('token')

		// redirect to login
		navigate('/login')
	}

	return !user ? loader : (
		<Layout>
			<div id='settings'>
				<button onClick={() => setEditing('add-friend')} style={blurStyle}>
					<h3>Add a friend</h3>
					<FontAwesomeIcon icon={ faUserPlus } />
				</button>
				<div style={blurStyle}>
					<h3>Username</h3>
					<h3>{user.uname}</h3>
					<FontAwesomeIcon icon={ faPen } onClick={() => setEditing('uname')} />
				</div>
				<div style={blurStyle}>
					<h3>Password</h3>
					<h3>**********</h3>
					<FontAwesomeIcon icon={ faPen } onClick={() => setEditing('pass')} />
				</div>
				<button style={blurStyle} onClick={() => setUser(null) & localStorage.removeItem('token') &  navigate('/login')}>
					<h3>Logout</h3>
					<FontAwesomeIcon icon={ faLongArrowAltRight } />
				</button>

				{(() => {
					switch (editing) {
						case 'add-friend': {
							return (<form onSubmit={handleSubmit(onAddFriend)}>
								<input name='uname' placeholder='John Doe' ref={register({ required: true })} />
								<ErrorMessage
									errors={errors}
									name='uname'
									style={{fontSize: '0.75rem', color: '#EF7B6C'}}
									as='p'
								/>

								<button type='submit'> Submit </button>
								<button onClick={() => setEditing(false)}> Cancel </button>
							</form>)
						}

						case 'uname': {
							return (<form onSubmit={handleSubmit(onChangeUname)}>
								<input name='uname' placeholder='New Username' ref={register({ required: true })} />

								<ErrorMessage
									errors={errors}
									name='uname'
									style={{fontSize: '0.75rem', color: '#EF7B6C'}}
									as='p'
								/>
								<button type='submit'> Submit </button>
								<button onClick={() => setEditing(false)}> Cancel </button>
							</form>)
						}

						case 'pass': {
							return (<form onSubmit={handleSubmit(onChangePass)}>
								<input name='current_pass' placeholder='Current Password' ref={register({ required: true })} />
								<ErrorMessage
									errors={errors}
									name='current_pass'
									style={{fontSize: '0.75rem', color: '#EF7B6C'}}
									as='p' />


								<input name='new_pass' placeholder='New Password' ref={register({ required: true })} />
								<input name='conf_pass' placeholder='Confirm Password' ref={register({ required: true })} />
								<ErrorMessage
									errors={errors}
									name='conf_pass'
									style={{fontSize: '0.75rem', color: '#EF7B6C'}}
									as='p' />

								<button type='submit'> Submit </button>
								<button onClick={() => setEditing(false)}> Cancel </button>
							</form>)
						}
					}
				})()}
			</div>
		</Layout>
	)
}

export default Settings
