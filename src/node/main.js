const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const updateViewCodeHttp = require('./src/index')

const app = new Koa()
app.use(bodyParser())

app.use(async (ctx, next) => {
  // console.log(ctx)
  if (ctx.method === 'POST') {
    // console.log(ctx.request.body)
    const { temp, data } = ctx.request.body
    updateViewCodeHttp(temp, data, (res, err) => {
      ctx.body = res
    })
  } else {
    ctx.body = 'hello koa'
  }
})

app.listen(3001, () => {
  console.log('server is running')
})
