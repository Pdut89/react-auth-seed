import React, { useState } from 'react'
import api from './api'
require('./config/api')

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
      const { data } = await api.user.post({
        email: 'elliot@test.com',
        password: 'admin'
      }, '/login')
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
      await api.user.post({}, '/logout')
      clearUser()
    } catch (error) {
      console.error(error)
      if (error.response.status === 401) clearUser()
    }
  }

  const handleCreateUser = async () => {
    try {
      await api.user.post({name: 'Pieter', role: 'super-admin', email: 'pieter@test.com', password: 'admin'})
    } catch (error) {
      console.error(error)
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

      <button onClick={handleCreateUser}>
        Create user
      </button>
    </div>
  )
}

export default App
