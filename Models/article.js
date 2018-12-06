const { db } = require("../Schema/config")
// 获取操作文章的权限
const ArticleShema = require("../Schema/article")
const Article = db.model("articles", ArticleShema)


module.exports = Article