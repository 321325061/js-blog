const { Schema } = require("./config.js")
const ObjectId  = Schema.Types.ObjectId

const  CommentShema = new Schema({
   // 头像 用户名
   // 文章
   // 内容
    content: String,
    //关联用户表
    from: {
        type: ObjectId,
        ref: "users"
    },
    //关联到 article 集合(表)   文档(数据)
    article: {
      type: ObjectId,
      ref: 'articles'
    }
} , {
    versionKey: false,
    timestamps: { createdAt: 'created'} //自带的，用来记录数据创建时间 ， 迟8H
})

// 设置 comment 的 remove 钩子hooks
/* pre 为前置钩子，可以有多个 ，当监听的事件('remove')发生之前来执行，执行完成后需要调用next来激活下一个钩子*/
/* post 后置钩子, 同样也是在事件发生之前来执行，但却是在最后一个执行，哪怕pre没有调用next也会执行*/
CommentShema.post('remove', (doc) => {
    // 当前事件会在save事件之前触发
    const Article = require('../Models/article')
    const User = require('../Models/user')
    
    // console.log(do)
    const {from ,article} = doc
    console.log('commentDoc:' + doc)
    // console.log('doc:' + from +'     '+article)
    // 对应文章的评论数 -1
    Article.updateOne({_id: article}, {$inc: {commentNum: -1}}).exec()
    // 对应被删除的评论的作者的 commentNum -1
    User.updateOne({_id: from}, {$inc: {commentNum: -1}}).exec()
})


module.exports = CommentShema   