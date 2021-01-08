import { api, cred, secret } from "./constants"

export const getToken = async () => {
  const axios = await import("axios"),
        {data: {jwt}} = await axios.post(api + "/auth/local", cred)

  return jwt
}

export const storeInCache = async (id) => {
  const jwt = await import("jsonwebtoken")

  jwt.sign({ id }, secret, (err, cacheToken) => {
    localStorage.setItem("token", cacheToken)
  })
}

export const getFromCache = async () => {
	const jwt = await import("jsonwebtoken"),
        cacheToken = localStorage.getItem("token")

  if (!cacheToken) return null

	return jwt.verify(cacheToken, secret, (err, data) => {
    return err ? null : data
	})
}

export const storeInDB = async (uname, pass, token) => {
  const axios = await import("axios"),
        url = api + "/chatters",
        data = {uname, pass},
        headers = {"Authorization": `Bearer ${token}`},
        {data:res} = await axios.post(url, data, {headers})

  return res
}

export const getFromDB = async ({ data, token }) => {
  const axios = await import("axios"),
        qs = await import("qs"),
        headers = {"Authorization": `Bearer ${token}`},
        url = api + `/chatters?` + qs.stringify({ _where: data }),
        { data:res } = await axios.get(url, {headers})

  return res[0]
}

export const checkIfExists = async (uname, token) => {
  const axios = await import("axios"),
        qs = await import("qs"),

        url = api + `/chatters?` + qs.stringify({
          _where: {uname}
        }),
        headers = {"Authorization": `Bearer ${token}`},
        { data:res } = await axios.get(url, {headers})

  return res[0]
}

export const updateDB = async (user, token) => {
  const axios = await import("axios"),
        url = api + "/chatters/" + user.id,
        headers = {"Authorization": `Bearer ${token}`},
        {data:res} = await axios.put(url, {...user}, {headers})

  return res
}
