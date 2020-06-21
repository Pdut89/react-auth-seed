
import React, { useState } from 'react'
import api from '../../api'

import { UserContext } from '../../context/user'

const Login = ({setUserAndTokens}) => {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

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

          <button onClick={handleSignIn}>
            Sign in
          </button>
        </div>

      )}
    </UserContext.Consumer>
  )
}

export default Login