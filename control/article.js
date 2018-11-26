const { db } = require("../Schema/config")
const ArticleShema = require("../Schema/article")


// 获取操作用户的权限
const UserShame = require("../Schema/user")
const User = db.model("users", UserShame)
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
  data.author = ctx.session.uid

  // console.log("username:" + ctx.session.username)
  
  await new Promise((resolve , reject) => {
    new Article(data).save((err, data) => {
        if(err) return reject(err)
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

//获取文章列表
exports.getList = async(ctx) => {
  //查找每篇文章对应的作者的头像
  let page = ctx.params.id || 1
  page--

  //使用集合元数据获取集合中估计的文档数
  let maxNum = await Article.estimatedDocumentCount((err , num)=>{
    err ?  console.log(err) : num
  })


  const num = 8
  const artList = await Article
    .find()
    .sort('-created') //倒序
    .skip(num * page) //跳过几条
    .limit(num) //拿到了多少条数据
    .populate({//mongo 用于连表的api
      path: 'author',  /*对象 因为在 Schama.artical.author 里已经关联好了 users 表 所以在这里只需要拿来关联属性
      即 可以得到 path 里面 ‘author’ 所关联的表的某些属性 */
      select: 'username _id avatar' //选择想要拿到哪些属性
    })
    .then( data => data) //在查询成功后返回数据 到 data
    .catch(err => console.log(err)) //查询失败后 输出 并返回信息给 data


  await ctx.render('index', {
    session: ctx.session,
    titles: "实战博客",
    artList,
    maxNum
  })
}