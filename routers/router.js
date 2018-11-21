const Router = require("koa-router")
const router = new Router

//设计主页
router.get("/" , async (ctx) => {
  await ctx.render("index",{
    // session:{
    //   role: 22
    // }
  })  
})

// 主要用来处理用户登陆，用户注册  用户退出
router.get(/^\/user\/(?=reg|login)/, async(ctx) => {
  //show 为 true 则显示注册 false 显示登陆
  const show = /reg$/.test(ctx.path)
  await ctx.render("register", {show})

})

//直接铺盖赋值
module.exports = router

//exports.router = router 如果是这么写，则导出去的时候是个对象
//如果需要引用此对象，需要 {router} = require("./xxx")