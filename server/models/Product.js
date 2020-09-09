// 商品模块
const mongoose = require('mongoose')
const productSchema = new mongoose.Schema({
  categoryId: { type: String, required: true }, // 所属分类的id
  name: { type: String, required: true }, // 名称
  price: { type: Number, required: true }, // 价格
  desc: { type: String },
  status: { type: Number, default: 1 }, // 商品状态: 1:在售, 2: 下架
  imgs: { type: Array, default: [] }, // n个图片文件名的json字符串
  detail: { type: String }
})

module.exports = mongoose.model('products', productSchema)
