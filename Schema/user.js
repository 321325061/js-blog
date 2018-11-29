const { Schema } = require("./config.js")

const userSchema = new Schema({
  username: String,
  password: String,
  articleNum: Number,
  commentNum: Number,
  role: {
    type: String,
    default: 1
  },
  avatar: {
    type: String,
    default: '/avatar/default.jpg' //默认值
  }
  
  //取消显示版本号
}, {versionKey: false})

module.exports = userSchema