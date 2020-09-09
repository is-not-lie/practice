const DB_CONFIG = {
  port: 27017,
  host: 'localhost',
  name: 'admin_db',
}
const SERVER_CONFIG = {
  port: 4000,
  host: 'localhost',
}

// token校验的白名单
const UN_CHECK_PATHS = ['/', '/login', '/img/upload']

// token签名加密的私钥
const PRIVATE_KEY = 'test'

module.exports = { DB_CONFIG, SERVER_CONFIG, UN_CHECK_PATHS, PRIVATE_KEY }
