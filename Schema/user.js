const { Schema } = require("./config.js")

const userSchema = new Schema({
  username: String,
  password: String,
  
  //取消显示版本号
}, {versionKey: false})

console.log("设置Schema:")
module.exports = userSchema