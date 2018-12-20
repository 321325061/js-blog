const { Schema } = require("./config.js")
const ObjectId  = Schema.Types.ObjectId

const UserSchema = new Schema({
  username: String,
  password: String,
  articleNum: Number,
  commentNum: Number,
  commentRole: {
    type: String,
    default: 1
  },
  role: {
    type: String,
    default: 1
  },
  avatar: {
    type: String,
    default: '/avatar/default.jpg' //默认值
  }

  //取消显示版本号
}, {versionKey: false,
  timestamps: { createdAt: 'created'}
})


UserSchema.post('remove', (doc) => {
  const Comment = require('../Models/comment')
  const Article = require('../Models/article')
 
  const { _id: id } = doc 

  //删除 用户对应 的评论
  Comment.find({from: id})
    .then(data => {data.forEach(v => v.remove())})
    .catch((err) => {console.log('CommentdataErr:' + err)})

  //找到 用户对应的 文章id
  Article.find({author: id})
    .then(data => {
      // console.log('data:--->' + data)
      data.forEach(v=> {
        // artListId.push(v._id),
        v.remove()
      })
      // console.log('artListId:' + artListId)
    })
    .catch(err => {console.log(err)})

    // 找到评论对应的 用户 评论数 -= 1
    /* Comment.find({_id: artList[0]}).exec((err,data) => {
      if(err){
        console.log(err)
      }else{
        console.log('Commentdata: ' + data)
        // User.updateOne({_id: data.from[0]}, {$inc: {commentNum: -1}}).exec()
      }  
    })  */
    
  })

module.exports = UserSchema