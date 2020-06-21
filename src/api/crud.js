import axios from 'axios'
const apiUrl = process.env.REACT_APP_API_URL

export default function (name) {
  const route = `${apiUrl}/${name}`

  return {
    get: (additional = '') => (
      axios.get(`${route}${additional}`)
    ),
    post: (data = {}, additional = '') => ( 
      axios.post(`${route}${additional}`, data) 
    ),
    patch: (data = {}, additional = '') => (
      axios.patch(`${route}/${additional}`, data)
    ),
    put: (data = {}, additional = '') => (
      axios.put(`${route}/${additional}`, data)
    ),
    delete: (additional = '') => (
      axios.delete(`${route}${additional}`)
    ),
  }
}