import React, {useState} from "react"
import { useForm } from "react-hook-form"
import { api, secret, loader } from "../shared/constants"
import { Context } from "../components/wrapper"
import { navigate, Link } from "gatsby"
import { ErrorMessage } from '@hookform/error-message'

function Signup(){
    const { handleSubmit, errors, setError, register, getValues } = useForm()
    const { token, setUser, isLoading } = React.useContext(Context)

    const onSubmit = async d => {
        // check if the passwords match
        if (d.conf_pass !== d.pass) {
            setError('conf_pass', { type: 'random', message: `Passwords don't match` })
        } else {
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
            setUser(res.data)
            navigate('/')
        }
    }

    React.useEffect(() => {
        console.log('Signup')
    }, [])

    return (
        <div id='signup'>
            <form onSubmit={handleSubmit(onSubmit)}>
                <h1>Let's Chat</h1>

                <input name="uname" placeholder="Username" ref={register({
                    required: true
                })} />

                <input name="pass" type="password" placeholder="Password"
                    ref={register({
                        required: true
                    })} />

                <input name="conf_pass" type="password" placeholder="Confirm Password"
                    ref={register({
                        required: true
                    })} />
                <ErrorMessage
                    errors={errors}
                    name='conf_pass'
                    style={{fontSize: '0.75rem', marginTop: '0.25rem', color: '#EF7B6C'}}
                    as='p'
                />

                <div>
                    <input type="submit" value="Sign Up" />
                    <Link to='/login'>Log In</Link>
                </div>
            </form>
        </div>
    )
}

export default Signup
