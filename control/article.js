const { db } = require("../Schema/config")
const ArticleShema = require("../Schema/article")

//通过 db 的来创建一个操作 user 数据库的模型对象
const Article = db.model("articles", ArticleShema)

// 返回文章发表页
exports.addPage = async (ctx) =>{
  await ctx.render('add-article' , {
    titles: "文章发表页",
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

  // 用户登陆的情况
  //在用户登陆的情况下， post 发过来的数据
  const data = ctx.request.body
  // 添加文章的作者
  data.author = ctx.session.username

  // console.log("username:" + ctx.session.username)
  
  await new Promise((resolve , reject) => {
    new Article(data).save((err, data) => {
        if(err) return reject(err)
        console.log(data)
        resolve(data)
    })
  })
  .then(data => {
    // console.log("then：" + data)
    ctx.body = {
      msg: "发表成功",
      status: 1 
    }
  })
  .catch((err) => {
    ctx.body = {
      msg: "发表失败",
      status: 0
    }
  })
}