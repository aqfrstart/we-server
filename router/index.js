//引入koa-router
const router = require('koa-router')()
//引入Artical Model
const Artical = require('../model/Artical.js');

router.get('/article', async (ctx, next) => {
  // 数据库查找数据
  const data = await Artical.find({}, { _id: 0, __v: 0 })
  ctx.body = data
})

module.exports = router