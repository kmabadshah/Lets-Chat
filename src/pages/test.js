import React, {useState} from "react"
import 'emoji-mart/css/emoji-mart.css'
import { Picker  } from 'emoji-mart'

function Test(){
	const [showPicker, setShowPicker] = React.useState(false)
	const [currentEmoji, setCurrentEmoji] = React.useState()

	return(
		<div>
			{showPicker && <Picker  onSelect={d => setCurrentEmoji(d.native)} />}
			<button onClick={() => setShowPicker(!showPicker)}>Click me!</button>
			{currentEmoji && currentEmoji}
		</div>
	)
}

export default Test
