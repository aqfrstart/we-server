//引入mongoose
const mongoose = require('mongoose')
//模式
const Schema = mongoose.Schema
//创建约束实例
const articalSchema = new Schema({
  author: String,
  title: String,
  url: String,
  tag: String,
  like: Number,
  dislike: Number
})
//创建模型对象
const Artical = mongoose.model('Artical', articalSchema)
module.exports = Artical