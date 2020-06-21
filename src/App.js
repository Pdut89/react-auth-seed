import React, { Component } from 'react'
import api from './api'

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";

import { UserContext } from './context/user'

import Home from './pages'
import Login from './pages/login'

require('./config/api')

class App extends Component {

  constructor() {
    super()
    const user = JSON.parse(localStorage.getItem('user'))

    this.state = {
      isLoading: true,
      user
    }
  }

  componentDidMount() {
    this.verifyAuthToken()
  }

  verifyAuthToken = async () => { 
    try {
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
      const { data } = await api.auth.post({ email, refreshToken }, '/refresh')
      this.setUserAndTokens(data)
    } catch (error) {
      console.error(error)
      this.clearUserAndTokens()
    } finally {
      this.setState({ isLoading: false })
    }
  }

  setUserAndTokens = ({ accessToken, refreshToken, user }) => {
    localStorage.setItem('token', accessToken)
    localStorage.setItem('refreshToken', refreshToken)
    localStorage.setItem('user', JSON.stringify(user))
    this.setState({ user })
  }

  clearUserAndTokens = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
    this.setState({ user: null })
  }

  render () {
    const { user, isLoading } = this.state
    
    if (isLoading) return <p>Loading...</p>

    return (
      <UserContext.Provider value={{ user }}>
        <Router>
          {user ? (
            <Switch>
              <Route exact path="/">
                <Home clearUserAndTokens={this.clearUserAndTokens} />
              </Route>
              <Route exact path="*">
                <Redirect to="/"/>
              </Route>
            </Switch>
          ) : (
            <Switch>
              <Route path="*">
                <Login setUserAndTokens={this.setUserAndTokens} />
              </Route>
            </Switch>
          )}
        </Router>
      </UserContext.Provider>
    )
  }
}

export default App
