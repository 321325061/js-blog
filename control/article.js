const Article = require('../Models/article')
const User  = require('../Models/user')
const Comment = require('../Models/comment')
const {join} = require('path')
const fs = require('fs')


// 返回文章发表页
exports.addPage = async (ctx) =>{
  await ctx.render('add-article' , {
    titles: "文章发表页",
    session: ctx.session
  })
}

// 文章的发表(保存到数据库)
exports.add = async (ctx) => {
  if(ctx.session.isNew){
    // true 没登陆 就不需要查询数据库
    return ctx.body = {
      msg: '用户未登陆',
      status: 0 
    }
  }

  // 用户登陆的情况
  //在用户登陆的情况下， post 发过来的数据
  const data = ctx.request.body
  // 添加文章的作者 
  data.author = ctx.session.uid
  data.commentNum = 0

  // console.log("username:" + ctx.session.username)
  
  await new Promise((resolve , reject) => {
    new Article(data).save((err, data) => {
        if(err) return reject(err)
        resolve(data)
        //更新用户文章计数
        User.update({_id: data.author}, {$inc:{articleNum: 1}}, err => {
          if(err) return console.log(err)
        })
    })
  })
  .then(data => {
    // console.log("then：" + data)
    ctx.body = {
      msg: "发表成功",
      status: 1 
    }
  })
  .catch((err) => {
    ctx.body = {
      msg: "发表失败",
      status: 0
    }
  })
}

//获取文章列表
exports.getList = async(ctx) => {
  //查找每篇文章对应的作者的头像
  let page = ctx.params.id || 1
  page--

  //使用集合元数据获取集合中估计的文档数
  let maxNum = await Article.estimatedDocumentCount((err , num)=>{
    err ?  console.log(err) : num
  })

  const num = 12
  const artList = await Article
    .find()
    .sort('-created') //倒序
    .skip(num * page) //跳过几条
    .limit(num) //拿到了多少条数据
    .populate({//mongo 用于连表的api
      path: 'author',  /*对象 因为在 Schama.artical.author 里已经关联好了 users 表 所以在这里只需要拿来关联属性
      即 可以得到 path 里面 ‘author’ 所关联的表的某些属性 */
      select: 'username _id avatar content' //选择想要拿到哪些属性
    })
    .then(data => {
      data.forEach((v ,i) => {
        data[i].content = v.content.replace(/<\/?.+?>/g,"").replace(/ /g,"")       
      }) 
      return data    
    }) //在查询成功后返回数据 到 data
    
    // .then(data =>{
    //   return data.forEach((v ,i) => {
    //     data[i].content = v.content.replace(/<\/?.+?>/g,"").replace(/ /g,"")       
    //   }) 
    // })
    .catch(err => console.log(err)) //查询失败后 输出 并返回信息给 data
    // data => 
  

    // 获得 轮播 img
    let  lunboList =[]
    {
    let url =  ctx.url
    const arr = fs.readdirSync(join(__dirname,'../public/img/lunbo'))//返回轮播图片名字字符串

 
    let imgName = []
    arr.forEach((v) => {
      imgName.push(v.replace(/[(\.jpg)$ + (\.png)$]/g, ''))
    }) // 获得图片名字(去除后缀)

    if(url === '/'){
      imgName.forEach((v ,i) => {
        lunboList.push(`img/lunbo/${v}.jpg`)
      })
    }else if(url.split("/")[1] === 'page'){
      imgName.forEach((v ,i) => {
        lunboList.push(`../../img/lunbo/${v}.jpg`)
      })
    }
  }

  
  await ctx.render('index', {
    session: ctx.session,
    titles: "实战博客",
    artList,
    maxNum,
    lunboList
  })
}

// 文章详情
exports.details = async(ctx) => {
  //获取文章 id
  const _id = ctx.params.id

  let commentRole = ctx.session.commentRole
  // console.log(commentRole)
  //查找文章本身数据
  const article = await Article
    .findById(_id)
    .populate('author', 'username')
    .then(data => data)

  const comment = await Comment
    .find({article: _id})
    .sort("-created")
    .populate('from', 'username avatar')
    .then(data => data)
    .catch(err => {console.log(err)})

  await ctx.render('article', {
    titles: "文章详情页",
    article,
    comment,
    commentRole,
    session: ctx.session
  })
}

//用户禁言
exports.commStop = async(ctx) => {
  const _id = ctx.params.id


  let res = {
    state: 1,
    message: '修改禁言成功'
  }

  User.findById(_id)
    .then(data => {
      let commentRole = data.commentRole
      if(commentRole === '1'){
        User.findByIdAndUpdate({_id}, {$set:{commentRole: 0}} , (err) => {if(err) return console.log(err)})
        res
      }
      if(commentRole === '0'){
        User.findByIdAndUpdate({_id}, {$set:{commentRole: 1}}, (err) => {if(err) return console.log(err)})
        res = {
          state: 1,
          message: '解禁成功'
        }
      }
    })    

ctx.body = res
}

// 后台管理 查询对应用户所有文章
exports.artlist = async (ctx) => {
  const uid = ctx.session.uid
  
  const data = await Article.find({author: uid})

  // console.log(data)
  ctx.body = {
    //固定传数据写法, layui标准
    code: 0,
    count: data.length,
    data
  }

}

// 删除对应 id 的所有文章
exports.del =  async(ctx) => {
  let _id = ctx.params.id
  
  let res = {
    state: 1,
    message: '成功'
  }

  await Article.findById(_id)
    .then(data => {data.remove(),console.log('artdata'+ data)})
    .catch(err => {
       res = {
        state: 0,
        message:  err
       }
    })

    ctx.body = res
}