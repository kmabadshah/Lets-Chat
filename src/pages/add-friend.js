import React, {useState} from "react"
import Layout from '../components/layout'
import { useForm } from 'react-hook-form'

function AddFriend(){
	const { handleSubmit, reset, register } = useForm()

	const onSubmit = (d) => {
		console.log(d)
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
