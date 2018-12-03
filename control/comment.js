const { db } = require("../Schema/config")

// 获取操作用户的权限
//通过 db 的来创建一个操作 user 数据库的模型对象
const UserShame = require("../Schema/user")
const User = db.model("users", UserShame) 

// 获取操作文章的权限
const ArticleShema = require("../Schema/article")
const Article = db.model("articles", ArticleShema)

//获得 comment.js 的实例对象
const CommentShema = require("../Schema/comment")
const Comment = db.model("comments", CommentShema)


// 保存评论
exports.save = async(ctx) => { 
  let message = {
      status: 0,
      msg: '登陆后才能评论'
  }
  //用户没有登陆
  if(ctx.session.isNew) return ctx.body = message

  //用户登陆了
  const data = ctx.request.body
  data.from = ctx.session.uid

  const _comment = new Comment(data)

  await _comment 
    .save()
    .then(data => {
      message = {  
        status: 1,
        msg: '评论成功'
      }
    
    // 更新当前文章的评论计数器
    Article
      .update({_id: data.article}, 
      {$inc:{'commentNum':1}}, //mongo的原子操作
      (err) => {
        if(err) return console.log(err)
        console.log('评论计数器更新成功')
      })
    

    //更新用户评论计数器
    User.update({_id: data.from}, {$inc: {'commentNum': 1}} ,err => {
      if(err) return console.log(err)
    })
  })

    .catch(err => {
      message = {
        status: 0,
        msg: err
      }
    })
    ctx.body = message
}

// 查询用户所有评论
exports.comlist = async (ctx) => {
  const uid = ctx.session.uid
  
  const data = await Comment
    .find({from: uid})
    .populate('article', 'titles')

  ctx.body = {
    //固定传数据写法, layui标准
    code: 0,
    count: data.length,
    data
  }

}

// 删除对应 id 的评论
exports.del =  async(ctx) => {
  const commentId = ctx.params.id

  console.log(ctx.params)

  let articleId , uid
  let isOK = true 

  await Comment.findById(commentId , (err ,data) => {
    if(err){
      console.log(err)
      isOK = false
      return
    }else{
      articleId = data.article
      uid = data.from
    }
  })
  await Article
    .update({_id: articleId} , {$inc:{commentNum: -1}})

  await User.update({_id: uid} , {$inc:{commentNum: -1}})

  await Comment.deleteOne({_id: commentId})

  if(isOK){
    ctx.body = {
      state: 1,
      message: '删除成功'
    }
  }
}