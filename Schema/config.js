//连接数据库 导出 db Schema
const mongoose = require("mongoose")
const db = mongoose.createConnection
  ("mongodb://localhost:27017/blogproject", {useNewUrlParser: true})

//虽然mongo的机制是，导出一次后便会缓存，下次读取时速度会更快
const Schema = mongoose.Schema

//用原生js的promise 覆盖 mongo的promise
mongoose.Promise = global.Promise

db.on("err" , () => {console.log("连接数据库失败")})
db.on("open" , () => {console.log("连接数据库成功")})

module.exports = {
  db,
  Schema
}