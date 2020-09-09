const ProductModel = require('../models/Product')
const { pageFilter } = require('../utils')

module.exports = (router) => {
  // 添加商品
  router.post('/product/add', (req, res) => {
    const product = req.body
    ProductModel.find({ name: product.name })
      .then((pro) => {
        if (pro.length) res.send({ status: 0, msg: '商品名称已存在' })
        else return ProductModel.create(product)
      })
      .then((data) => data && res.send({ status: 200, data }))
      .catch((err) => {
        console.error(`添加商品异常,错误信息:${err}`)
        res.send({
          status: 0,
          msg: '添加商品异常,请稍后重新尝试',
        })
      })
  })
  // 获取商品分页
  router.get('/product/list', (req, res) => {
    const { pageNum, pageSize } = req.query
    ProductModel.find({})
      .then((products) => {
        const data = pageFilter(products.reverse(), pageNum, pageSize)
        data && res.send({ status: 200, data })
      })
      .catch((err) => {
        console.error(`获取商品列表异常,错误信息:${err}`)
        res.send({ status: 0, msg: '获取商品列表异常, 请重新尝试' })
      })
  })
  // 搜索商品列表
  router.get('/product/search', (req, res) => {
    const { pageNum, pageSize, productName, productDesc } = req.query
    const contition = productName
      ? { name: new RegExp(`^.*${productName}.*$`) }
      : { desc: new RegExp(`^.*${productDesc}.*$`) }
    ProductModel.find(contition)
      .then(pro => {
        const data = pageFilter(pro, pageNum, pageSize)
        console.log(data)
        data && res.send({ status: 200, data })
      })
      .catch(error => {
        console.error('搜索商品列表异常', error)
        res.send({ status: 0, msg: '搜索商品列表异常, 请重新尝试' })
      })
  })
  // 根据商品id获取商品
  router.get('/product/info', (req, res) => {
    const { productId } = req.query
    ProductModel.findOne({ _id: productId })
      .then(data => data && res.send({ status: 200, data }))
      .catch(err => {
        console.error(`获取商品异常,错误信息${err}`, )
        res.send({
          status: 0,
          msg: '获取商品异常,请稍后重新尝试'
        })
      })
  })
  // 更新商品状态
  router.post('/product/setstatus', (req, res) => {
    const { productId, status } = req.query
    ProductModel.updateOne({ _id: productId }, { status })
      .then(() => res.send({ status: 200 }))
      .catch((err) => {
        console.error(`更新商品状态异常,错误信息:${err}`)
        res.send({ status: 0, msg: '更新商品状态异常,请稍后重新尝试' })
      })
  })
  // 更新商品信息
  router.post('/product/update', (req, res) => {
    const product = req.body
    ProductModel.findOneAndUpdate({ _id: product._id }, product)
      .then((data) => res.send({ status: 200 }))
      .catch((err) => {
        console.error(`更新商品信息异常,错误信息:${err}`)
        res.send({ status: 0, msg: '修改商品信息失败,请稍后重新尝试' })
      })
  })
  // 删除商品
  router.get('/product/delete', (req, res) => {
    const { productId } = req.query
    ProductModel.deleteOne({ _id: productId })
      .then((data) => res.send({ status: 200 }))
      .catch((err) => {
        console.error(`删除商品异常,错误信息:${err}`)
        res.send({ status: 0, msg: '删除失败,请稍后重新尝试' })
      })
  })
}
