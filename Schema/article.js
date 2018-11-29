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

module.exports = ArticleShema 