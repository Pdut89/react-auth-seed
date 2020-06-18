import axios from 'axios'
import crud from './crud'
const apiUrl = process.env.REACT_APP_API_URL

export default {
  ...crud('user')
}
