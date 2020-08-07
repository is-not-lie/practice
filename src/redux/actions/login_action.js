import { LOGIN, OUTLOGIN } from '../action_type'
// 登录事件
export const createLoginAction = (v) => {
  localStorage.setItem('user', JSON.stringify(v.user))
  localStorage.setItem('token', v.token)
  return { type: LOGIN, data: v }
}
// 退出登录事件
export const outLogin = () => {
  localStorage.removeItem('user')
  localStorage.removeItem('token')
  return { type: OUTLOGIN }
}
