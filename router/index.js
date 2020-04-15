//引入koa-router
const router = require('koa-router')()
//引入Movie Model
const Movie = require('../model/Movie')

// 接口路径
const API_URL_DICT = {
  MOVIE_MANAGE: {
    add: '/movie-manage'
  }
}

// 电影管理相关接口
router.post(API_URL_DICT.MOVIE_MANAGE.add, async (ctx, next) => {
  const resParams = ctx.request.body
  console.log(ctx.request.body)
  try {
    // 向数据库中插入数据
    Artical.create(resParams)
    console.log('插入数据成功')
  } catch (error) {
    console.log('插入数据失败', error)
  }
  ctx.response.body = 'success'
})

module.exports = router