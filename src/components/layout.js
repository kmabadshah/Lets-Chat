import React, {useState} from 'react'
import { Link } from 'gatsby'

function Layout({ children, style }){
	return(
		<div id='layout' style={style}>
			<div id='navbar'>
				<Link to='/'>Home</Link>
				<Link to='/settings'>Settings</Link>
			</div>
			{ children }
		</div>
	)
}

export default Layout
