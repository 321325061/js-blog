const { Schema } = require("./config")


const  ArticleShema = new Schema({
    title: String,
    conntent: String,
    author: String
} , {versionKey: false})

exports.exports = ArticleShema  