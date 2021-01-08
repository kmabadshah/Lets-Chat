import React, {useState} from "react"
import Layout from '../components/layout'
import { useForm } from 'react-hook-form'
import { Context } from '../components/wrapper'
import { api } from '../shared/constants'

function AddFriend(){
	const { handleSubmit, reset, register } = useForm()
	const { token, user, setUser } = React.useContext(Context)

	const onSubmit = async (d) => {
		const axios = await import('axios')
		const qs = await import('qs')

		// check if the person exists
		const res = await axios.get(api+'/chatters?'+qs.stringify({
			_where: { uname: d.uname }
		}), { headers: { Authorization: `Bearer ${token}` } })

		// update the local user state, which will automagically send the data to db
		if (res.data[0]) setUser({
			...user, friends: [
				...user.friends,
				{ uname: d.uname,
					messagesSentByMe: [],
					messagesSentToMe: []
				}
			]
		})


		reset()
	}

	return(
		<Layout>
			<div id='add-friend'>
				<form autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
					<input name='uname' autoComplete='false' ref={register({
						required: true
					})} placeholder='John Doe' />
					<input type="submit" value="Submit" />
				</form>
			</div>
		</Layout>
	)
}

export default AddFriend
