// 获取指定分页函数
exports.pageFilter = (arr, pageNum, pageSize) => {
  pageNum = pageNum * 1
  pageSize = pageSize * 1
  const total = arr.length
  const pages = Math.floor((total + pageSize - 1) / pageSize)
  const start = pageSize * (pageNum - 1)
  const end = start + pageSize <= total ? start + pageSize : total
  const list = []
  for (let i = start; i < end; i++) {
    list.push(arr[i])
  }

  return {
    pageNum,
    total,
    pages,
    pageSize,
    list,
  }
}
// token验证中间件
const jwt = require('jsonwebtoken')
const { PRIVATE_KEY, UN_CHECK_PATHS } = require('../config')

exports.token = (req, res, next) => {
  const url = req.url

  // 如果是登录请求，不进行验证
  if (UN_CHECK_PATHS.indexOf(url) !== -1) return next()

  let token = req.headers['authorization']

  // 若无token
  if (!token)
    return res.status(401).json({
      status: 0,
      msg: '请先登录',
    })

  // 若有token，则截取签名密钥(test)后的token进行校验
  token = token.slice(4)
  jwt.verify(token, PRIVATE_KEY, (err, data) => {
    if (err) {
      console.error(`校验失败,错误信息:${err.message}`)
      return res.status(401).json({
        status: 2,
        msg: '身份校验失败,请重新登录',
      })
    } else {
      req.user = data
      return next()
    }
  })
}
