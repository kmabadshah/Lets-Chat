import React, {useState} from "react"
import Layout from '../components/layout'
import { useForm } from 'react-hook-form'
import { ErrorMessage  } from '@hookform/error-message'
import { Context } from '../components/wrapper'
import { api } from '../shared/constants'

function AddFriend(){
	const { handleSubmit, reset, register, errors, setError} = useForm()
	const { token, user, setUser } = React.useContext(Context)

	const onSubmit = async (d) => {
		try {
			const axios = await import('axios')
			const qs = await import('qs')

			// check if the person exists
			const res = await axios.get(api+'/chatters?'+qs.stringify({
				_where: { uname: d.uname }
			}), { headers: { Authorization: `Bearer ${token}` } })

			// check if already friend
			const alreadyFriend = user.friends.find(f => f.uname === d.uname)
			if (alreadyFriend) {
				setError('uname', {
					type: 'random', shouldFocus: true,
					message: 'That person is already your friend'
				})
			} else {

				// update the local user state, which will automagically send the data to db
				if (res.data[0]) {
					setUser({
						...user, friends: [
							...user.friends,
							{ uname: d.uname,
								messagesSentByMe: [],
								messagesSentToMe: []
							}
						]})

					reset() // clear everything out
				} else {
					setError('uname', {
						type: 'random', shouldFocus: true,
						message: "That user doesn't exist"
					})
				}
			}
		} catch (err) {
			setError('uname', {
				type: 'random', shouldFocus: true,
				message: 'Something went wrong, please try again'
			})
			console.log(err)
		}
	}

	return(
		<Layout>
			<div id='add-friend'>
				<form autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
					<input name='uname' autoComplete='false' ref={register({
						required: true
					})} placeholder='John Doe' />
					<input type="submit" value="Submit" />

					<ErrorMessage
						errors={errors}
						name='uname'
						render={(d) => {
							return <p>{d.message}</p>
						}}
					/>
				</form>
			</div>
		</Layout>
	)
}

export default AddFriend
