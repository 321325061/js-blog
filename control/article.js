const { db } = require("../Schema/config")
const ArticleShame = require("../Schema/article")

//通过 db 的来创建一个操作 user 数据库的模型对象
const Article = db.model("articles", ArticleShame)

// 返回文章发表页
exports.addPage = async (ctx) =>{
  await ctx.render('add-article' , {
    title: "文章发表页",
    session: ctx.session
  })
}

// 文章的发表(保存到数据库)
exports.add = async (ctx) => {
  if(ctx.session.isNew){
    // true 没登陆 就不需要查询数据库
    return ctx.body = {
      msg: '用户未登陆',
      status: 0 
    }
  }
}
// exports.add