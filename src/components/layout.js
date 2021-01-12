import React, {useState} from 'react'
import { Link } from 'gatsby'

function Layout({ children }){
	return(
		<div id='layout'>
			<div id='navbar'>
				<Link to='/'>Home</Link>
				<Link to='/settings'>Settings</Link>
			</div>
			{ children }
		</div>
	)
}

export default Layout
