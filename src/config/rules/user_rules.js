export const addUserRules = {
  username: { required: true, message: '用户名不能为空' },
  password: { required: true, message: '密码不能为空' },
  phone: { required: true, message: '手机号不能为空' },
  email: { required: true, message: '邮箱不能为空' },
  role_id: { required: true, message: '角色不能为空' },
}
