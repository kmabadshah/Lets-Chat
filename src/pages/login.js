import React, {useState} from "react"
import { loader, api, secret } from "../shared/constants"
import { Context } from "../components/wrapper"
import { navigate } from "gatsby"
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
            _where: { uname: d.uname }
        }), { headers: { Authorization: `Bearer ${token}` } })

        if (res.data[0]) {
            setUser(res.data[0])

            // create token with user data and store into cache
            jwtpkg.sign({ uname: d.uname }, secret, (err, jwt) => {
                err ? console.log(err) :
                localStorage.setItem('token', jwt)
            })

            // redirect
            navigate('/')
        } else {
            console.log('invalid creds')
            reset()
        }
    }

    React.useEffect(() => {
        console.log('login')
    }, [])

    return isLoading ? loader : (
        <div>
            <form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
                <input name="uname" autoComplete="false" placeholder="username" ref={register({
                    required: true
                })} />

                <input name="pass" type="password" autoComplete="false" placeholder="password"
                    ref={register({
                        required: true
                    })} />


                <input type="submit" value="Submit" />
            </form>
        </div>
    )
}

