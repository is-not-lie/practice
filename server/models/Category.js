const mongoose = require('mongoose')
const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  create_time: { type: String, default: Date.now() },
})
module.exports = mongoose.model('categorys', categorySchema)
