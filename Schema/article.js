const { Schema } = require("./config.js")
const ObjectId  = Schema.Types.ObjectId

const  ArticleShema = new Schema({
    titles: String,
    content: String,
    tips: String,
    commentNum: Number,
    author: {
        type: ObjectId,
        ref: "users"
    },//关联 user 表···
} , {
    versionKey: false,
    timestamps: { createdAt: 'created'} //自带的，用来记录数据创建时间 ， 迟8H
})

ArticleShema.post('remove', (doc) => {
    const Comment = require('../Models/comment')
    const User = require('../Models/user')

    const { _id: artId , author: authorId } = doc

    console.log('Artdoc:' + doc)
    
    // 只需要用户的articleNum -= 1
    User.findByIdAndUpdate(authorId , {$inc: { articleNum: -1}}).exec()

    // 把当前需要删除的文档所关联的所有评论 一次调用 评论 remove
    Comment.find({article: artId})
        .then(data => {
            data.forEach(v => v.remove())
        })
})


module.exports = ArticleShema 