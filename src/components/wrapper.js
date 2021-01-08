import React from 'react'
import { errors, secret, loader, api, cred } from '../shared/constants'
import axios from 'axios'
import { navigate } from 'gatsby'
import jwtpkg from 'jsonwebtoken'

export const Context = React.createContext()

export default function Wrapper({ children, location }) {
    const [user, setUser] = React.useState()
    const [isLoading, setIsLoading] = React.useState(true)
    const [token, setToken] = React.useState()
    const [finishedPainting, setFinishedPainting] = React.useState(false)
    const [socket, setSocket] = React.useState()

    React.useLayoutEffect(() => {
        let foundUser = false

        ;(async () => {

            // get and set the token
            const { data: { jwt } } = await axios.post(api+"/auth/local", cred)
            setToken(jwt)

            // check the cache for data
            if (localStorage.getItem('token')) {
                const token = localStorage.getItem('token')
                const decData = jwtpkg.verify(token, secret, (err, decData) => {
                    err && console.log(err)
                    return err ? null : decData
                })

                // get full data from db
                if (decData) {
                    const qs = await import('qs')
                    const res = await axios.get(api + '/chatters?' + qs.stringify({
                        _where: { uname: decData.uname }
                    }), { headers: { Authorization: `Bearer ${jwt}` } })

                    setUser(res.data[0])
                    foundUser = true
                }
            }

            // trying to access restricted pages without logging in
            if (!foundUser &&
                (location.pathname !== '/login' && location.pathname !== '/signup'))
                navigate('/login')

            // trying to access restrcited pages without logging out
            else if (foundUser &&
                (location.pathname === '/login' || location.pathname === '/signup'))
                navigate('/')

            setTimeout(() => setIsLoading(false), 1000)
        })()


    }, [])

    return (
        <Context.Provider value={{
            setUser, user,
            isLoading, token,
            socket, setSocket
        }}>
            {getView()}
        </Context.Provider>
    )

    function getView() {
        if (isLoading) return loader
        else {
            if (!token) return errors.random
            else return children
        }
    }
}

