export const usernameRules = [
  { required: true, message: '用户名不能为空' },
  {
    max: 12,
    message: '用户名最大长度为12位',
  },
  {
    min: 4,
    message: '用户名必须大于4位',
  },
  {
    pattern: /^[a-zA-Z_*-.]/,
    message: '请以字母或_-*.等字符开头',
  },
]
export const passwordRules = [
  { required: true, message: '密码不能为空' },
  {
    max: 20,
    message: '密码必须小于20位',
  },
  {
    min: 6,
    message: '密码必须大于6位',
  },
]
