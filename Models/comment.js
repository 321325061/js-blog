const { db } = require("../Schema/config")
// 获取操作文章的权限
const CommentShema = require("../Schema/comment")
const Comment = db.model("comments", CommentShema)


module.exports = Comment