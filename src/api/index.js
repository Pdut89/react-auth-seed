import crud from './crud'

const auth = crud('auth')
const user = crud('user')

export default {
  auth,
  user
}