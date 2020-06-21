
import React, { useState } from 'react'
import api from '../../api'
import { UserContext } from '../../context/user'

const Login = ({setUserAndTokens, clearUserAndTokens}) => {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [userList, setUserList] = useState([])

  const handleSignIn = async () => {
    try {
      const { data } = await api.auth.post({
        email,
        password
      })
      setUserAndTokens(data)
    } catch (error) {
      console.error(error)
    }
  }

  const handleLogOut = async () => {
    try {
      await api.auth.post({}, '/logout')
    } catch (error) {
      console.error(error)
    } finally {
      clearUserAndTokens()
      setUserList([])
    }
  }

  const handleGetUsers = async () => {
    try {
      const users = await api.user.get()
      setUserList(users.data)
    } catch (error) {
      console.error(error)
      setUserList([{
        email: 'Access token expired'
      }])
    }
  }

  return (
    <UserContext.Consumer>
      {({user}) => (

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: 300,
            margin: '30px'
          }}
        >
          {user ? (
            <h4>
              Logged in as: {user.name}
            </h4>
          ) : (
              <>
                <input
                  type="text"
                  name="email"
                  value={email}
                  onChange={({target}) => setEmail(target.value)}
                />

                <input
                  type="password"
                  name="password"
                  value={password}
                  onChange={({ target }) => setPassword(target.value)}
                />
              </>
            )}

          <button onClick={user ? handleLogOut : handleSignIn}>
            {user ? 'Log out' : 'Sign in'}
          </button>

          {user && (
            <button onClick={handleGetUsers}>
              Get users
            </button>
          )}

          {userList.length > 0 && (
            <>
              <h2>User List</h2>
              <ul>
                {userList.map(({ email }) => (
                  <li>{email}</li>
                ))}
              </ul>
            </>
          )}
        </div>

      )}
    </UserContext.Consumer>
  )
}

export default Login