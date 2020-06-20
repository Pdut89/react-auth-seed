import React, { Component } from 'react'
import api from './api'
require('./config/api')

class App extends Component {

  constructor() {
    super()

    const accessToken = localStorage.getItem('token')
    const user = JSON.parse(localStorage.getItem('user'))

    this.state = {
      isLoading: true,
      accessToken,
      user,
      email: '',
      password: '',
      userList: []
    }
  }

  componentDidMount() {
    this.verifyAuthToken()
  }

  verifyAuthToken = async () => {
    const { accessToken, user } = this.state
    
    try {
      if (!accessToken || !user?.email) throw new Error('Token not available')
      const { data } = await api.auth.post({}, '/verify')
      const { shouldRefreshToken } = data

      if (shouldRefreshToken) return this.refreshAuthTokens()
      this.setState({isLoading: false})
    } catch (error) {
      console.error(error)
      if (error.response?.status === 401) {
        this.refreshAuthTokens()
      } else {
        this.clearUserAndTokens()
        this.setState({isLoading: false})
      }
    }
  }

  refreshAuthTokens = async () => { 
    this.setState({isLoading: true})
    const { email } = this.state.user || {}
    const refreshToken = localStorage.getItem('refreshToken')

    try {
      if (!refreshToken) throw new Error('Token not available')
      const { data } = await api.auth.post({
        email,
        refreshToken
      }, '/refresh')
      this.setUserAndTokens(data)
    } catch (error) {
      console.error(error)
      this.clearUserAndTokens()
    } finally {
      this.setState({ isLoading: false })
    }
  }

  handleChange = ({target}) => {
    const { name, value } = target 
    console.log(target)

    this.setState({
      [name]: value
    })
  }

  setUserAndTokens = ({ accessToken, refreshToken, user }) => {
    localStorage.setItem('token', accessToken)
    localStorage.setItem('refreshToken', refreshToken)
    localStorage.setItem('user', JSON.stringify(user))

    this.setState({
      accessToken,
      user
    })
  }

  clearUserAndTokens = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')

    this.setState({
      accessToken: null,
      user: null
    })
  }

  handleSignIn = async () => {
    const { email, password } = this.state
    try {
      const { data } = await api.auth.post({
        email,
        password
      })
      this.setUserAndTokens(data)
    } catch (error) {
      console.error(error)
    }
  }

  handleLogOut = async () => {
    try {
      await api.auth.post({}, '/logout')
    } catch (error) {
      console.error(error)
    } finally {
      this.clearUserAndTokens()
      this.setState({
        userList: []
      })
    }
  }

  handleGetUsers = async () => {
    try {
      const users = await api.user.get()
      this.setState({
        userList: users.data || []
      })
    } catch (error) {
      console.error(error)
      this.setState({
        userList: [{
          email: 'Access token expired'
        }]
      })
    }
  }

  render () {
    const { accessToken, user, userList, email, password } = this.state
    const isAuthorised = !!accessToken && !!user

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: 300,
          margin: '30px'
        }}
      >
        {isAuthorised ? (
          <h4>
            Logged in as: {user.name}
          </h4>
        ) : (
            <>
              <input
                type="text"
                name="email"
                value={email}
                onChange={this.handleChange}
              />

              <input
                type="password"
                name="password"
                value={password}
                onChange={this.handleChange}
              />
            </>
          )}

        <button onClick={user ? this.handleLogOut : this.handleSignIn}>
          {isAuthorised ? 'Log out' : 'Sign in'}
        </button>

        {isAuthorised && (
          <button onClick={this.handleGetUsers}>
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
    )
  }



  // if (isLoading) {
  //   return <h4>Loading...</h4>
  // }
  
}

export default App
