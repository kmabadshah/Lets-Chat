import React, {useState} from "react"
import { useForm } from "react-hook-form"
import { api, secret, loader } from "../shared/constants"
import { Context } from "../components/wrapper"
import { navigate } from "gatsby"

function Signup(){
    const { handleSubmit, errors, setError, register, getValues } = useForm()
    const { token, setUser, isLoading } = React.useContext(Context)

    const onSubmit = async d => {
        const axios = await import('axios')
        const jwt = await import('jsonwebtoken')

        // send the data
        const res = await axios.post(api+'/chatters', {
            uname: d.uname, pass: d.pass
        }, { headers: { Authorization: `Bearer ${token}` } })

        // store in cache
        jwt.sign({ uname: d.uname }, secret, (err, cacheToken) => {
            localStorage.setItem('token', cacheToken)
        })

        // update the user state with the new user
        setUser(res)

        // redirect
        navigate('/')
    }

    React.useEffect(() => {
        console.log('Signup')
    }, [])

    return isLoading ? loader : (
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <input name="uname" placeholder="username" ref={register({
                    required: true
                })} />

                <input name="pass" type="password" placeholder="password"
                    ref={register({
                        required: true
                    })} />

                <input name="confPass" type="password" placeholder="confirm password"
                    ref={register({
                        required: true, validate: v => v === getValues('pass')
                    })} />

                <input type="submit" value="Submit" />
            </form>
        </div>
    )
}

export default Signup
