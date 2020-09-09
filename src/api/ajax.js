import axios from 'axios'
import qs from 'qs'
import { message } from 'antd'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import store from '../redux/store'
// import { BASE_URL } from '../config'
// 配置基本路径与超时时间
const instance = axios.create({
  baseURL: '',
  timeout: 5000,
})
// 请求拦截
instance.interceptors.request.use((config) => {
  // 开启进度条动画
  NProgress.start()
  // 获取redux中保存的token
  const { token } = store.getState().userInfo
  // 如果有token则在请求头添加token
  if (token) config.headers.Authorization = `test${token}`
  const { data, method } = config
  // 处理post请求参数为urlencoded格式
  if (method.toLowerCase() === 'post')
    config.data = data instanceof Object ? qs.stringify(data) : data
  return config
})

// 响应拦截
instance.interceptors.response.use(
  (value) => {
    // 停止进度条动画，脱掉axios封装的壳
    NProgress.done()
    const { status, data, msg } = value.data
    if (status >= 200 && status < 300) return data || true
    else
      msg
        ? message.error(msg, 1)
        : message.error('当前网络不稳定，请稍后重新尝试', 1)
    return new Promise(() => {})
  },
  () => {
    // 停止进度条动画，统一处理错误
    NProgress.done()
    message.error('当前网络不稳定，请稍后重新尝试', 1)
    return new Promise(() => {})
  }
)
export default instance
