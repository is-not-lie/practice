// 角色权限管理模块
const mongoose = require('mongoose')

const roleSchema = new mongoose.Schema({
  name: { type: String, required: true }, // 角色名称
  auth_name: String, // 授权人
  auth_time: Number, // 授权时间
  create_time: { type: Number, default: Date.now }, // 创建时间
  menus: Array // 所有有权限操作的菜单path的数组
})

module.exports = mongoose.model('roles', roleSchema)