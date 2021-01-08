import React, {useState} from "react"
import { Context } from '../components/wrapper.js'
import { socketServer, loader } from "../shared/constants"
import io from 'socket.io-client'
import Layout from '../components/layout'

import '../styles/css/index.css'

function Index(){
	const { user, isLoading, socket, setSocket } = React.useContext(Context)

	React.useEffect(() => {
		// connect to chat server
		const tempSocket = io(socketServer, {
			query: { uname: user.uname }
		})
		setSocket(tempSocket)

	}, [])

	return isLoading ? loader : (
		<Layout>
			<h1>Main user page</h1>
		</Layout>
	)
}
export default Index



