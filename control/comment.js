const Article = require('../Models/article')
const User  = require('../Models/user')
const Comment = require('../Models/comment')

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

  // console.log(_comment)

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
      {$inc:{'commentNum': 1}}, //mongo的原子操作
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

    // console.log(data)
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

  let res = {
    state: 1,
    message: '成功'
  }

  await Comment.findById(commentId)
    .then(data => data.remove())
    .catch(err => {
        res = {
          state: 0,
          message: err
        }
    })

  ctx.body = res
}

// 用户禁言
exports.userStop = async(ctx) => {
  let userId = ctx.params.id
  let res = {
    state: 1,
    message: '成功'
  }
  await User.findById(userId)
    .then(data => {
      console.log('userdata'+ data),
      // data.remove()  
      data.commentRole = 0      
    })
    .catch(err => {
       res = {
        state: 0,
        message:  err
       }
    })

    ctx.body = res
}