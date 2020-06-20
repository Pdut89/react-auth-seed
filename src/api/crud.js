import axios from 'axios'
const apiUrl = process.env.REACT_APP_API_URL

export default function (name) {
  const route = `${apiUrl}/${name}`

  return {
    post: (data = {}, additional = '') => ( 
      axios.post(`${route}${additional}`, data) 
    ),
    get: (additional = '') => (
      axios.get(`${route}${additional}`)
    )
  }
}