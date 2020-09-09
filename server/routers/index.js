const express = require('express')
const jwt = require('jsonwebtoken')
const md5 = require('md5')
const UserModel = require('../models/User')
const RoleModel = require('../models/Role')
const { PRIVATE_KEY } = require('../config')
const router = express.Router()

// 登陆模块
router.post('/login', (req, res) => {
  const { username, password } = req.body
  UserModel.findOne({ username, password: md5(password) }, { password: 0, __v: 0 })
    .then((user) => {
      if (user) {
        // 登陆成功生成token
        const token = jwt.sign({ id: user._id }, PRIVATE_KEY, {
          expiresIn: '30 days',
        })
        // 查询用户权限(有id的话)
        if (user.role_id) {
          RoleModel.findOne({ _id: user.role_id })
            .then(role => { user._doc.role = role })
        } else user._doc.role = { menus: [] }
        res.send({ status: 200, data: { user, token } })
      } else res.send({ status: 0, msg: '用户名或密码不正确!' })
    })
    .catch((err) => {
      console.error(`登录异常,错误信息:${err}`)
      res.send({ status: 0, msg: '登陆失败,请稍后重新尝试' })
    })
})

require('./category')(router)
require('./product')(router)
require('./role')(router)
require('./user')(router)
require('./file_upload')(router)

module.exports = router
