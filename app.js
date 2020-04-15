const Koa = require('koa')
const app = new Koa()
// const db = require('./db/index.js')
const router = require('./router/index.js')
const bodyParser = require('koa-bodyparser')
app.use(bodyParser())

const axios = require('axios')

// util
const { checkShareInvalid } = require('./util/business.js')

// app.use((ctx, next) => {
//   ctx.body = '待完成~~~'
// })

app.use(router.routes())
app.use(router.allowedMethods())

// const shareList = ['https://pan.baidu.com/share/init?surl=lCaTEpw4ximE_nkEYxZ6Yg']
// checkShareInvalid(shareList)

app.listen(8888, () => { console.log('服务启动成功~服务器地址http://localhost:8888') })
