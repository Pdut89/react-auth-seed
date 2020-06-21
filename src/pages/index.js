import React from 'react' 
import api from '../api'

const Home = ({ clearUserAndTokens }) => {

  const handleLogOut = async () => {
    try {
      await api.auth.post({}, '/logout')
    } catch (error) {
      console.error(error)
    } finally {
      clearUserAndTokens()
    }
  }

  return (
    <>
      <h1>Home Page</h1>
      <button onClick={handleLogOut}>
        Log out
      </button>
    </>  
  )
}

export default Home

