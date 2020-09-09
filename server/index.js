const mongoose = require('mongoose')
const express = require('express')
const { resolve } = require('path')
const cookieParser = require('cookie-parser')
const { token } = require('./utils')
const { DB_CONFIG, SERVER_CONFIG } = require('./config')
const app = express()

// 暴露静态资源
app.use(express.static(resolve(__dirname, './static')))
// 解析post请求体参数
app.use(express.urlencoded({ extended: true }))
// 处理json格式的请求体参数
// app.use(express.json())
// 声明使用token验证的中间件
app.use(cookieParser())
app.use(token)
// 设置cors跨域  如果没有配置代理请开启
app.use((req, res, next) => {
  res.set('Access-Control-Allow-Origin', '*')
  res.set('Access-Control-Allow-Methods', '*')
  res.set('Access-Control-Allow-Headers', '*')
  // res.set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
  // res.set('Access-Control-Allow-Headers', 'content-type, authorization, accept')
  res.set('Access-Control-Max-Age', 86400)
  if (req.method.toLowerCase() === 'options') return res.end()
  next()
})

// 使用路由器中间件
app.use('/', require('./routers'))

mongoose
  .connect(`mongodb://${DB_CONFIG.host}:${DB_CONFIG.port}/${DB_CONFIG.name}`, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log('数据库链接成功')
    app.listen(SERVER_CONFIG.port, () => {
      console.log(
        `服务器已启动,请访问: http://${SERVER_CONFIG.host}:${SERVER_CONFIG.port}`
      )
    })
  })
  .catch((err) => {
    console.log(`服务器启动失败,错误信息:${err}`)
  })
