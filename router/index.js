//引入koa-router
const router = require('koa-router')()
//引入Movie Model
const Movie = require('../model/Movie.js')

// 接口路径
const API_URL_DICT = {
  MOVIE_MANAGE: {
    add: '/movie-manage',
    put: '/movie-manage',
    list: '/movie-manage/list'
  }
}

// 新增数据
router.post(API_URL_DICT.MOVIE_MANAGE.add, async (ctx, next) => {
  const resParams = ctx.request.body
  // TODO: 如果关键字已存在, 提示失败
  try {
    // 向数据库中插入数据
    Movie.create(resParams)
    console.log('插入数据成功')
    // 响应结果
    ctx.response.body = {
      status: 'success',
      message: '新增成功！',
      content: {}
    }
  } catch (error) {
    console.log('插入数据失败', error)
    ctx.response.body = {
      status: 'error',
      message: '新增失败！',
      content: {}
    }
  }
})

// 修改数据
router.put(API_URL_DICT.MOVIE_MANAGE.put, async (ctx, next) => {
  const resParams = ctx.request.body
  const id = resParams.id
  
  Movie.findByIdAndUpdate(id, resParams, {}, function (err, doc) {
    if (err) {
      console.log('修改失败')
      return false
    }
    // 响应结果
    ctx.response.body = {
      status: 'success',
      message: '修改成功！',
      content: Movie.findById(id)
    }
  })

})

// 查找数据
router.post(API_URL_DICT.MOVIE_MANAGE.list, async (ctx, next) => {
  const resParams = ctx.request.body
  // 需要模糊查询的字段
  // 关键字
  const keyword = resParams.keyword
  const keywordReg = new RegExp(keyword, 'i')

  // 主演
  const actor = resParams.actor
  const actorReg = new RegExp(actor, 'i')

  let searchParams = {
    keyword: keywordReg,
    actor: actorReg,
    // isUpdate: resParams.isUpdate,
    // isValid: resParams.isValid,
    movieType: { $in: resParams.movieType },
    movieUpdateTime: { 
      $elemMatch: {
        $in: resParams.movieUpdateTime
      }
    }
  }

  // 兼容movieType空数组情况
  if (resParams.movieType.length <= 0) {
    delete searchParams.movieType
  }

  if (resParams.movieUpdateTime.length <= 0) {
    delete searchParams.movieUpdateTime
  }

  const content = await Movie.find(searchParams)

  console.log('等待content', content)
  // 响应结果
  ctx.response.body = {
    status: 'success',
    message: '查询成功！',
    content: {
      total: content.length,
      data: content
    }
  }
})

router.get('/xxx', async (ctx, next) => {
  console.log(ctx)
})


module.exports = router