const mongoose = require('mongoose')
const md5 = require('md5')
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: String,
  email: String,
  avatar: { type: String, default: 'default.png' }, // 用户头像
  create_time: { type: Number, default: Date.now },
  role_id: String, // 用户权限等级,初始为1:普通权限
})

const UserModel = mongoose.model('users', userSchema)

UserModel.findOne({ username: 'admin' }).then((user) => {
  if (!user) {
    UserModel.create({ username: 'admin', password: md5('123456'), avatar: 'admin.jpg' }).then(
      (user) => console.log('初始化用户: 用户名: admin 密码为: 123456')
    )
  }
})

module.exports = UserModel
