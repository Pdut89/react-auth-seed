import React, { useState } from 'react'
import axios from 'axios'

const apiUrl = process.env.REACT_APP_API_URL

axios.interceptors.request.use(
  config => {
    const { origin } = new URL(config.url)
    const allowedOrigins = [apiUrl]
    const token = localStorage.getItem('token')
    if (allowedOrigins.includes(origin)) {
      config.headers.authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

function App() {

  const storedJwt = localStorage.getItem('token')
  const storedUser = JSON.parse(localStorage.getItem('user'))

  const [authToken, setAuthToken] = useState(storedJwt)
  const [user, setUser] = useState(storedUser)

  function clearUser() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setAuthToken(null)
    setUser(null)
  }

  const handleSignIn = async () => {
    try {
      const { data } = await axios.post(`${apiUrl}/user/login`, {
        email: 'test1@test.com',
        password: 'admin'
      })
      const { accessToken, user } = data 

      localStorage.setItem('token', accessToken)
      localStorage.setItem('user', JSON.stringify(user))

      setAuthToken(accessToken)
      setUser(user)
    } catch (error) {
      console.error(error)
    }
  }

  const handleLogOut = async () => {
    try {
      await axios.post(`${apiUrl}/user/logout`)
      clearUser()
      
    } catch (error) {
      console.error(error)
      if (error.response.status === 401) clearUser()
    }
  }
  
  return (
    <div>
      <h4>
        {!!authToken && user && `Logged in as: ${user.name}`}
      </h4>
      <button onClick={user ? handleLogOut : handleSignIn}>
        {!!authToken ? 'Log out' : 'Sign in'}
      </button>
    </div>
  )
}

export default App
