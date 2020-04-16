  //引入mongoose
const mongoose = require('mongoose')
//模式
const Schema = mongoose.Schema
//创建约束实例
const MovieSchema = new Schema({
  keyword: {                    // 查询关键字 【必选】
    type: String,
    required: true
  },              
  content: {                    // 查询内容 【必选】
    type: String,
    required: true
  },              
  matchType: {                  // 匹配类型  0: 模糊匹配  1: 完全匹配 【必选】
    type: Number,
    required: true
  },
  movieType: {                  // 电影类型 【必选】
    type: Number,
    required: true
  },
  movieUpdateTime: {            // 电影更新时间
    type: [Number],
    required: true
  },
  isUpdate: {
    type: Number,
    required: true,
    default: 0
  },
  isValid: {
    type: Number,
    required: true,
    default: 1
  },
  desc: {                       // 简介 【非必选】
    type: String
  },
  actor: {                      // 主演 【非必选】
    type: String
  },
  hotNum: Number                   // 热度 根据点击增加热度
  // createTime: String,           // 创建时间, 时间戳
  // updateTime: String,           // 更新时间, 时间戳
}, { timestamps: { createdAt: 'createTime', updatedAt: 'updateTime' } })
//创建模型对象
const Movie = mongoose.model('Movie', MovieSchema)
module.exports = Movie