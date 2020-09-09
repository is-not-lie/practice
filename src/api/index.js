import instance from './ajax'
import jsonp from 'jsonp'
import { message } from 'antd'
import { CITY, AK } from '../config'
// 请求登录
export const reqLogin = (v) => instance.post('/login', v)
// 获取天气信息
export const reqWeatherInfo = () =>
  new Promise((resolve, reject) => {
    jsonp(
      `http://api.map.baidu.com/telematics/v3/weather?location=${CITY}&output=json&ak=${AK}`,
      (err, data) => {
        if (err) {
          message.error('暂时无法获取天气信息，请联系管理人员')
          return new Promise(() => {})
        } else {
          const {
            dayPictureUrl,
            weather,
            temperature,
          } = data.results[0].weather_data[0]
          resolve({ dayPictureUrl, weather, temperature })
        }
      }
    )
  })
// 请求商品分类列表
export const reqCategoryList = () => instance.get('/category/list')
// 请求添加商品分类
export const reqAddCategory = (v) => instance.post('/category/add', v)
// 请求修改商品分类
export const reqUpdateCategory = (v) =>
  instance.post('/category/update', v)
// 根据分类ID获取分类信息
export const reqCategoryInfo = (id) =>
  instance.get('/category/info', { params: { id } })
// 请求商品分页列表
export const reqProductList = (pageNum = 1, pageSize = 5) =>
  instance.get('/product/list', { params: { pageNum, pageSize } })
// 请求搜索商品分页列表
export const reqSearchProductList = (
  pageNum = 1,
  pageSize = 5,
  productType,
  keyWord
) =>
  instance.get('/product/search', {
    params: {
      pageNum,
      pageSize,
      [productType]: keyWord,
    },
  })
// 请求更新商品状态
export const reqUpdateProductStatus = (productId, status) =>
  instance.post('/product/setstatus', { productId, status })
// 请求删除图片
export const reqRemoveImg = (name) =>
  instance.post('/img/delete', { name })
// 请求添加商品
export const reqAddProduct = (v) => instance.post('/product/add', v)
// 根据ID请求商品信息
export const reqProductInfo = (productId) =>
  instance.get('/product/info', { params: { productId } })
// 请求更新商品信息
export const reqUpdateProduct = (v) =>
  instance.post('/product/update', v)
// 请求获取角色列表
export const reqRoleList = () => instance.get('/role/list')
// 请求添加角色
export const reqAddRole = (v) => instance.post('/role/add', v)
// 请求更新角色权限
export const reqUpdateRole = (v) => instance.post('/role/update', v)
// 获取用户列表
export const reqUserList = () => instance.get('/user/list')
// 请求添加用户
export const reqAddUser = (v) => instance.post('/user/add', { ...v })
// 请求更新用户信息
export const reqUpdateUser = (v) =>
  instance.post('/user/update', { ...v })
// 请求删除用户
export const reqDelUser = (userId) =>
  instance.post('/user/delete', { userId })
