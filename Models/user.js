const { db } = require("../Schema/config")
// 获取操作文章的权限
const UserShema = require("../Schema/user")
const User = db.model("users", UserShema)


module.exports = User