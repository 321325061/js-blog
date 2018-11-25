const Router = require("koa-router")

//拿到操作 user 表的逻辑对象
const user = require("../control/user")
const article = require("../control/article")


const router = new Router

//设计主页
router.get("/" , user.keepLog ,async (ctx) => {
  await ctx.render("index", {
    session: ctx.session,
    title:"假装这是一条正经的title"
  })  
})

// 主要用来处理返回 用户登陆，用户注册  用户退出
router.get(/^\/user\/(?=reg|login)/, async(ctx) => {
  //show 为 true 则显示注册 false 显示登陆
  const show = /reg$/.test(ctx.path)
  await ctx.render("register", {show})

})

//注册用户 路由
router.post("/user/reg", user.reg)

//用户登陆路由
router.post("/user/login", user.login)

//用户退出路由
router.get("/user/logout", user.logout)

//文章发表页面
router.get('/article', user.keepLog , article.addPage)

//文章添加
router.post('/article', user.keepLog , article.add)


//直接铺盖赋值
module.exports = router

//exports.router = router 如果是这么写，则导出去的时候是个对象
//如果需要引用此对象，需要 {router} = require("./xxx")