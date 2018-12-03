const { db } = require("../Schema/config")

//通过 db 的来创建一个操作 user 数据库的模型对象
// 获取操作用户的权限
const UserShame = require("../Schema/user")
const User = db.model("users", UserShame)
// 获得 article 权限
const ArticleShema = require("../Schema/article")
const Article = db.model("articles", ArticleShema)
// 获得操作评论 comment 权限
const CommentShema = require("../Schema/comment")
const Comment = db.model("comments", CommentShema)


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
  data.commentNum = 0

  // console.log("username:" + ctx.session.username)
  
  await new Promise((resolve , reject) => {
    new Article(data).save((err, data) => {
        if(err) return reject(err)
        resolve(data)
        //更新用户文章技术
        User.update({_id: data.author}, {$inc:{articleNum: 1}}, err => {
          if(err) return console.log(err)
        })
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

// 文章详情
exports.details = async(ctx) => {
  //获取文章 id
  const _id = ctx.params.id
  
  //查找文章本身数据
  const article = await Article
    .findById(_id)
    .populate('author', 'username')
    .then(data => data)

  const comment = await Comment
    .find({article: _id})
    .sort("-created")
    .populate('from', 'username avatar')
    .then(data => data)
    .catch(err => {console.log(err)})

  await ctx.render('article', {
    titles: "文章详情页",
    article,
    comment,
    session: ctx.session
  })

}


// 后台管理 查询对应用户所有文章
exports.artlist = async (ctx) => {
  const uid = ctx.session.uid
  
  const data = await Article.find({author: uid})

  console.log(data)
  ctx.body = {
    //固定传数据写法, layui标准
    code: 0,
    count: data.length,
    data
  }

}

// 删除对应 id 的所有文章
exports.del =  async(ctx) => {
  let articleId = ctx.params.id
  
  // 用户的 articleNum -= 1
  //还要删除文章对应的评论
  //还要在 评论所对应的用户中 把 commentNum -= 1

  let res = {}
  await new  Article.findById(_id , (err , data) => {
    if(err) return console.log(err)
    uid = data.author

    Article.deleteOne({_id}).then(err => {
      if(err){
        res = {
          state: 1,
          message: '删除失败'
        }
      }
    })
  })
  
  
  

  await User.update({_id: uid}, {$inc: {articleNum: -1}})

  //删除所有的评论
  await Comment.find({article: _id})

}