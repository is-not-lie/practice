const multer = require('multer')
const path = require('path')
const fs = require('fs')
const { SERVER_CONFIG } = require('../config')

const dirPath = path.join(__dirname, '..', 'public/upload')
console.log(dirPath)
const uploadSingle = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      if (!fs.existsSync(dirPath))
        fs.mkdir(dirPath, (err) => {
          if (err) console.log(err)
          else cb(null, dirPath)
        })
      else cb(null, dirPath)
    },
    filename(req, file, cb) {
      cb(
        null,
        file.fieldname + '-' + Date.now() + path.extname(file.originalname)
      )
    },
  }),
}).single('image')

module.exports = (router) => {
  // 上传图片
  router.post('/img/upload', (req, res) => {
    uploadSingle(req, res, (err) => {
      if (err) {
        console.error(`文件上传异常,错误信息:${err}`)
        return res.send({
          status: 0,
          msg: '图片上传失败',
        })
      }
      const { filename } = req.file
      res.send({
        status: 200,
        data: {
          name: filename,
          url: `http://${SERVER_CONFIG.host}:${SERVER_CONFIG.port}/upload/${filename}`,
        },
      })
    })
  })

  // 删除图片
  router.post('/img/delete', (req, res) => {
    console.log(req.body)
    const { name } = req.body
    fs.unlink(path.join(dirPath, name), (err) => {
      if (err) {
        console.error(`文件删除异常,错误信息:${err}`)
        return res.send({
          status: 0,
          msg: '删除文件失败',
        })
      }
      res.send({ status: 200 })
    })
  })
}
