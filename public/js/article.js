
layui.use(['layedit', 'layer', 'element'], function(){
  const $ = layui.$
  const layedit = layui.layedit;
  const layer = layui.layer
  const uploadImage = layui.uploadImage


  const idx = layedit.build('comment-txt', {
    tool: [],
    height: 160
  }); //建立编辑器

  // layedit.set({
  //   uploadImage: {
  //     url: '' //接口url
  //     ,type: '' //默认post
  //   }
  // });uploadImage

  $(".layui-unselect.layui-layedit-tool").hide() //隐藏

  $('#jyBtn').click(() => {
    layer.msg("你评论不了的啦~")
  })

  $(".comment button").click(async () => {
    let content = layedit.getContent(idx).trim()

    if(content.length === 0)return layer.msg("评论内容不能为空")

    const data = {
      content,
      article: $(".art-title").data("artid")
    }

    $.post("/comment", data, (data) => {
      layer.msg(data.msg, {
        time: 1000,
        end(){
          if(data.status === 1){
            // 评论成功就重载页面
            window.location.reload()
          }
        }
      })
    })
  })
});