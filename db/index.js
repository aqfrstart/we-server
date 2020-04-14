// 引入mongoose存储爬取的文章信息
const mongoose = require('mongoose');
const DB_URL = 'mongodb://localhost:27017/juejin'

module.exports = new Promise((resolve, reject) => {
  //连接数据库
  mongoose.connect(DB_URL, { useNewUrlParser: true });
  mongoose.connection.once('open', err => {
    if (!err) {
      console.log('数据库连接成功')
      resolve()
    } else {
      reject('数据库连接失败：' + err)
    }
  })
})