const Router = require("koa-router")

//拿到操作 user 表的逻辑对象
const user = require("../control/user")
const article = require("../control/article")
const comment = require("../control/comment")
const admin = require("../control/admin")
const about = require("../control/about-up")
const upload = require('../util/upload')

const router = new Router

//设计主页
router.get("/" , user.keepLog , article.getList)
// 设计关于博主
router.get("/about_up", about.aboutInd)

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


// 文章列表分页 路由
router.get("/page/:id", article.getList)

// 文章详情页面
router.get('/article/:id', user.keepLog ,article.details)

// 用户禁言
router.post('/article/comStop/:id', user.keepLog , article.commStop)

// 发表评论
router.post('/comment', user.keepLog, comment.save)

//后台管理页面 文章 评论 头像 上传
router.get('/admin/:id', user.keepLog, admin.index)

// 头像上传功能
/* single 上传单个文件; file 为前端上传图像的input标签的name值
upload.single('file')每次上传单个照片的配置信息 */
router.post('/upload', user.keepLog , upload.single('file') , user.upload)


// 获得用户所有评论
router.get('/user/comments' , user.keepLog , comment.comlist)
// 后台  删除用户评论
router.del('/comment/:id', user.keepLog , comment.del)


// 获得用户的所有文章
router.get('/user/articles' , user.keepLog , article.artlist)
// 后台  删除用户文章
router.del('/article/:id', user.keepLog , article.del)


// 获得所有用户
router.get('/user/users' , user.keepLog , user.userlist)
// 后台  删除用户
router.del('/user/:id', user.keepLog , user.del)



//  任意路由访问 404页面
router.get('*' , async ctx => {
  await ctx.render('404', {
      title: '404',

  })
})


//直接铺盖赋值
module.exports = router

//exports.router = router 如果是这么写，则导出去的时候是个对象
//如果需要引用此对象，需要 {router} = require("./xxx")