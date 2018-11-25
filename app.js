const koa = require("koa")
const router = require("./routers/router")
const static = require("koa-static")
const views = require("koa-views")
const body = require("koa-body")
const logger  = require("koa-logger")
const { join } = require("path")
const session = require("koa-session")

//生成 koa 实例
const app = new koa

app.keys = ["宇健"]
//配置session对象
const CONFIG = {
  key:"Sid",
  masAge: 36e5,
  overwrite: true,
  httpOnly: true,
  signed: true,
  //是否刷新操作时间
  rolling: true
}

//注册静态文件模板
app.use(static(join(__dirname , "public")))
// 配置 koa-body 处理 post 请求数据
app.use(body())
// 注册日志模块
app.use(logger())
//注册 session
app.use(session(CONFIG , app))
//注册 koa-views 模板
app.use(views(join(__dirname , "views") ,{ 
    extension: "pug"
}))


//注册路由信息
app
  .use(router.routes())
  .use(router.allowedMethods())
  .listen(3000 , () => {
    console.log('项目启动成功，监听3000端口')
  })








