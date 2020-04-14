const Koa = require('koa')
const app = new Koa()
const db = require('./db/index.js')
const router = require('./router/index.js')

// app.use((ctx, next) => {
//   ctx.body = '待完成~~~'
// })

app.use(router.routes())
app.use(router.allowedMethods())

app.listen(8888, () => { console.log('服务启动成功~服务器地址http://localhost:8888') })


