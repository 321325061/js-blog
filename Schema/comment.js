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

module.exports = CommentShema   