import { LOGIN, OUTLOGIN } from '../action_type'

const user = JSON.parse(localStorage.getItem('user'))
const token = localStorage.getItem('token')
const initState = {
  user: user || '',
  token: token || '',
  isLogin: user && token ? true : false,
}

export default (preState = initState, action) => {
  const { type, data } = action
  let newState
  switch (type) {
    case LOGIN:
      newState = { user: data.user, token: data.token, isLogin: true }
      return newState
    case OUTLOGIN:
      newState = { user: '', token: '', isLogin: false }
      return newState
    default:
      return preState
  }
}
