const { db } = require("../Schema/config")
const UserShame = require("../Schema/user")
const encrypt = require('../util/encrypt')

//通过 db 的来创建一个操作 user 数据库的模型对象
const User = db.model("users", UserShame)

// 用户注册
exports.reg = async ctx => {
  // 用户注册时 post 发过来的数据
  const user = ctx.request.body
  const username = user.username
  const password = user.password
  // 注册时 应该干嘛  以下操作假设 格式 符合。
  // 1、去数据库 user 先查询当前发过来的 username 是否存在
  await new Promise((resolve, reject) => {
    // 去 users 数据库查询
    User.find({username}, (err, data) => {
      if(err)return reject(err)
      // 数据库查询没出错？ 还有可能没有数据
      if(data.length !== 0){
        // 查询到数据 -->  用户名已经存在
        return resolve("")
      }
      // 用户名不存在  需要存到数据库
      // 保存到数据库之前需要先加密，encrypt模块是自定义加密模块
      const _user = new User({
        username,
        password: encrypt(password),
        articleNum: 0,
        commentNum: 0
      })
      
      _user.save((err, data) => {
        if(err){
          reject(err)
        }else{
          resolve(data)
        }
      })
    })
  })
  .then(async data => {
    if(data){
      // 注册成功
      await ctx.render("isOk", {
        status: "注册成功"
      })
    }else{
      // 用户名已存在
      await ctx.render("isOk", {
        status: "用户名已存在"
      })
    }
  })
  .catch(async err => {
    await ctx.render('isOk', {
      status: "注册失败，请重试"
    })
  })
}

//用户登陆
exports.login = async ctx => {
  const user = ctx.request.body
  username = user.username
  password = user.password

  await new Promise((resolve , reject) => {
    User.find({username}, (err ,data) => {
      if(err) return reject(err)
      if(data.length === 0) return reject("用户名不存在") 

      //把用户传过来的密码，跟数据库的密码匹配
      if(data[0].password === encrypt(password)){
        //密码正确
        return resolve(data)
      }else{
        resolve("")
      }
    })
  })
  .then(async data => {
    if(!data){
      return ctx.render("isOk" , {
        status: '密码不正确，登录失败'
      })
    }

    //让用户在他的 cookie 里设置 username password 加密后的密码 权限
    ctx.cookies.set("username", username, {
      //配置cookie
      domain: 'localhost',
      path: '/',
      maxAge: 36e5, //一天
      httpOnly: true, // true 不让客户端访问这个 cookie
      overwrite: true,
      signed: false  //是否显示签名
    })
    //用户在数据库的 _id 值
    ctx.cookies.set("uid", data[0]._id, {
      //配置cookie
      domain: 'localhost',
      path: '/',
      maxAge: 36e5, //一天
      httpOnly: true, //不让客户端访问这个 cookie
      overwrite: true,
      signed: false //是否显示签名
    })

    //手动设置用户 session 过期
    // ctx.cookies = null 

    ctx.session = {
      username,
      uid: data[0]._id,
      avatar: data[0].avatar,
      role: data[0].role
    }

    //登陆成功
    await ctx.render('isOk', {
      status: '登陆成功'
    })
  })
  .catch(async err => {
    await ctx.render("isOk" ,{
      status: '登录失败'
    })
  })
}

//确定用户的状态  保持用户的状态
//为什么要next？ 因为保持登陆状态对于加载主页时来说必须是 第一个加载的，如果之后还有其他的中间件就需要使用next
exports.keepLog = async(ctx , next) => {
  // isNew 确认 session 对象是否是全新的值
  if(ctx.session.isNew){
    //session 没有
    //没有登陆
     if(ctx.cookies.get("username")){

      let uid = ctx.session.get('username')
        const avatar = await User.findById(uid)
        .then(data => data.avatar)
      
        ctx.session = {
          username: ctx.cookies.get("username"),
          uid: ctx.cookies.get("uid")
        }
     }
  }
  //登陆了状态
  await next()
}

//退出登陆
exports.logout = async(ctx) => {
  ctx.session = null
  ctx.cookies.set("username" , null , {
    maxAge: 0
  })
  ctx.cookies.set("uid" , null , {
    maxAge: 0
  })
  console.log(1)
  ctx.redirect("/")
}

//用户头像上传
exports.upload = async(ctx) => {
  const filename = ctx.req.file.filename  
  let data = {}

  await User.update({_id: ctx.session.uid} , 
      {$set: {avatar: '/avatar/'+ filename}}, 
      (err , res) => {
        if(err){
          data = {
            status: 0,
            message: '上传失败'
          }
        }else{
          data = {
            status: 1,
            message: '上传成功'
          }
        }
      })

    //更新session中的头像地址
  ctx.session.avatar =  '/avatar/'+ filename
  ctx.body= data
}