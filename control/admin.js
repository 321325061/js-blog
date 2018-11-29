const { db } = require("../Schema/config")
const fs = require('fs')
const { join } = require('path')
// 获取操作用户的权限
//通过 db 的来创建一个操作 user 数据库的模型对象
const UserShame = require("../Schema/user")
const User = db.model("users", UserShame) 

// 获取操作文章的权限
const ArticleShema = require("../Schema/article")
const Article = db.model("articles", ArticleShema)

//获得 comment.js 的实例对象
const CommentShema = require("../Schema/comment")
const Comment = db.model("comments", CommentShema)

exports.index = async (ctx) => {
    if(ctx.session.isNew){
      //没有登陆
      ctx.status = 404
      return await ctx.render('404',{title:'404'})
    }


    const id = ctx.params.id
    const arr = fs.readdirSync(join(__dirname, '../views/admin')) //返回文件名字字符串
    let flag = false
    arr.forEach((v) => {
      const name = v.replace(/^(admin\-)|(\.pug)$/g, '')
      if(name === id) {
          flag = true
      }
    })

      console.log(ctx.session.username +"的role:"+ ctx.session.role)
    if(flag){
      await ctx.render('./admin/admin-' + id, {
        role: ctx.session.role
      })
    }else{
      ctx.status = 404
      await ctx.render('404' , {title: '404'})      
    }
}