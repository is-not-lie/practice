const CategoryModel = require('../models/Category')

module.exports = (router) => {
  // 添加商品分类
  router.post('/category/add', (req, res) => {
    const { categoryName } = req.body
    CategoryModel
      .findOne({ name: categoryName })
      .then((data) => {
        if (data) res.send({ status: 0, msg: '该分类已存在' })
        else return CategoryModel.create({ name: categoryName })
      })
      .then((data) => data && res.send({ status: 200, data }))
      .catch((err) => {
        console.log(`添加商品分类异常,错误信息:${err}`)
        res.send({ status: 0, msg: '添加分类失败,请稍后重新尝试' })
      })
  })
  // 获取商品分类
  router.get('/category/list', (req, res) => {
    CategoryModel
      .find({})
      .then((data) => data && res.send({ status: 200, data }))
      .catch((err) => {
        console.log(`读取商品分类异常,错误信息:${err}`)
        res.send({ status: 0, msg: '获取商品分类失败,请稍后重新尝试' })
      })
  })
  // 更新分类名称
  router.post('/category/update', (req, res) => {
    const { id, categoryName } = req.body
    CategoryModel.findOneAndUpdate({ _id: id }, { name: categoryName })
      .then(data => res.send({ status: 200 }))
      .catch(err => {
        console.error(`更新分类名称异常,错误信息:${err}`, )
        res.send({ status: 0, msg: '更新异常, 请稍后重新尝试' })
      })
  })

  // 根据分类ID获取分类
  router.get('/category/info', (req, res) => {
    const { id } = req.query
    CategoryModel.findOne({ _id: id })
      .then(data => data && res.send({ status: 200, data }))
      .catch(err => {
        console.error(`获取分类信息异常,错误信息:${err}`)
        res.send({ status: 0, msg: '获取分类信息异常, 请稍后重新尝试' })
      })
  })
}
