const md5 = require('md5')
const UserModel = require('../models/User')
const RoleModel = require('../models/Role')

module.exports = (router) => {
  // 添加用户
  router.post('/user/add', (req, res) => {
    const { username, password } = req.body
    UserModel.findOne({ username })
      .then((user) => {
        if (user) {
          res.send({ status: 0, msg: '该用户已存在' })
          return new Promise(() => { })
        } else return UserModel.create({ ...req.body, password: md5(password) })
      })
      .then((data) => data && res.send({ status: 200, data }))
      .catch((err) => {
        console.error(`添加用户异常,错误信息:${err}`)
        res.send({ status: 0, msg: '添加用户异常, 请稍后重新尝试' })
      })
  })

  // 更新用户
  router.post('/user/update', (req, res) => {
    const user = req.body
    UserModel.findOneAndUpdate({ _id: user._id }, user)
      .then((oldUser) => {
        const data = Object.assign(oldUser, user)
        res.send({ status: 0, data })
      })
      .catch((err) => {
        console.error(`更新用户异常,错误信息:${err}`)
        res.send({ status: 0, msg: '更新用户异常, 请稍后重新尝试' })
      })
  })

  // 删除用户
  router.post('/user/delete', (req, res) => {
    const { userId } = req.body
    UserModel.deleteOne({ _id: userId })
      .then((data) => res.send({ status: 200 }))
  })

  // 获取所有用户列表
  router.get('/user/list', (req, res) => {
    UserModel.find({ username: { $ne: 'admin' } })
      .then((users) => {
        RoleModel.find()
          .then((roles) => {
            res.send({ status: 200, data: { users, roles } })
          })
      })
      .catch((err) => {
        console.error(`获取用户列表异常,错误信息:${err}`)
        res.send({ status: 0, msg: '获取用户列表异常, 请稍后重新尝试' })
      })
  })
}
