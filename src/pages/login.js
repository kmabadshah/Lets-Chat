import React, {useState} from "react"
import { loader, api, secret } from "../shared/constants"
import { Context } from "../components/wrapper"
import { navigate, Link } from "gatsby"
import { ErrorMessage } from '@hookform/error-message'
import { useForm } from "react-hook-form"

export default function Login(){
    const { isLoading, token, setUser } = React.useContext(Context)
    const { handleSubmit, reset, errors, setError, register } = useForm()

    const onSubmit = async (d) => {
        const axios = await import('axios')
        const qs = await  import('qs')
        const jwtpkg = await import('jsonwebtoken')

        // data -> db check
        const res = await axios.get(api+'/chatters?'+qs.stringify({
            _where: { uname: d.uname, pass: d.pass }
        }), { headers: { Authorization: `Bearer ${token}` } })

        if (!res.data[0]) {
            setError('uname', { type: 'random', message: `Invalid username or password` })
        } else {
            setUser(res.data[0])
            // create token with user data and store into cache
            jwtpkg.sign({ uname: d.uname }, secret, (err, jwt) => {
                err ? console.log(err) :
                    localStorage.setItem('token', jwt)
            })
            // redirect
            navigate('/')
        }
    }

    React.useEffect(() => {
        console.log('login')
    }, [])

    return (
        <div id='login'>
            <form autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
                <h1>Let's Chat</h1>

                <input name="uname" autoComplete="false" placeholder="Username" ref={register({
                    required: true
                })} />
                <ErrorMessage
                    errors={errors}
                    name='uname'
                    style={{fontSize: '0.75rem', marginTop: '0.25rem', color: '#EF7B6C'}}
                    as='p'
                />

                <input name="pass" type="password" autoComplete="false" placeholder="Password"
                    ref={register({
                        required: true
                    })} />

                <div>
                    <input type="submit" value="Login" />
                    <Link to='/signup'>Sign Up</Link>
                </div>
            </form>
        </div>
    )
}

