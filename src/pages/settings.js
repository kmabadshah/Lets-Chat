import React, {useState} from "react"
import Layout from '../components/layout'
import { navigate } from 'gatsby'

function Settings(){
	const logOut = () => {
		// remove data from cache
		localStorage.removeItem('token')

		// redirect to login
		navigate('/login')
	}

	return(
		<Layout>
			<div id='settings'>
				<button onClick={() => logOut()}> <h1>Log Out</h1> </button>
			</div>
		</Layout>
	)
}

export default Settings
