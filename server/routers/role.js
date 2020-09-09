// 角色权限管理模块
const RoleModel = require('../models/Role');

module.exports = (router) => {
  // 添加角色
  router.post('/role/add', (req, res) => {
    const { roleName } = req.body
    RoleModel.create({ name: roleName })
      .then(data => data && res.send({ status: 200, data }))
      .catch(err => {
        console.error(`添加角色异常,错误信息:${err}`)
        res.send({ status: 0, msg: '添加角色异常, 请稍后重新尝试' })
      })
  })

  // 获取角色列表
  router.get('/role/list', (req, res) => {
    RoleModel.find()
      .then(data => data && res.send({ status: 200, data }))
      .catch(err => {
        console.error(`获取角色列表异常,错误信息:${err}`)
        res.send({ status: 0, msg: '获取角色列表异常, 请稍后重新尝试' })
      })
  })

  // 更新角色(设置权限)
  router.post('/role/update', (req, res) => {
    const role = req.body
    role.auth_time = Date.now()
    RoleModel.findOneAndUpdate({ _id: role._id }, role)
      .then(oldRole => {
        res.send({ status: 200, data: { ...oldRole, ...role } })
      })
      .catch(err => {
        console.error(`更新角色异常,错误信息:${err}`)
        res.send({ status: 0, msg: '更新角色异常, 请稍后重新尝试' })
      })
  })
}