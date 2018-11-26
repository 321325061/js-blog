const { Schema } = require("./config.js")

const userSchema = new Schema({
  username: String,
  password: String,
  avatar: {
    type: String,
    default: '/avatar/default.jpg'
  }
  
  //取消显示版本号
}, {versionKey: false})

module.exports = userSchema