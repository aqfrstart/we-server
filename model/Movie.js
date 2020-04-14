  //引入mongoose
const mongoose = require('mongoose')
//模式
const Schema = mongoose.Schema
//创建约束实例
const MovieSchema = new Schema({
  keyword: String,              // 查询关键字
  content: String,              // 查询内容
  searchType: Number,           // 匹配类型  0: 模糊匹配  1: 完全匹配
  createTime: String,           // 创建时间, 时间戳
  updateTime: String,           // 更新时间, 时间戳
  movieType: String,            // 电影类型
  movieUpdateTime: String       // 电影更新时间
})
//创建模型对象
const Movie = mongoose.model('Movie', MovieSchema)
module.exports = Movie