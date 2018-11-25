const { Schema } = require("./config.js")


const  ArticleShema = new Schema({
    titles: String,
    content: String,
    tips: String,
    author: String
} , {
    versionKey: false,
    timestamps:{createAt:'created'} //自带的，用来记录数据创建时间 ， 迟8H
})

module.exports = ArticleShema 