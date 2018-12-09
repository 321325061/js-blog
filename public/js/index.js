layui.use(['element', 'laypage', 'carousel'], function(){
  let element = layui.element,
      laypage = layui.laypage,
      carousel = layui.carousel,
      $ = layui.$
  
  element.tabDelete('demo', 'xxx')

  laypage.render({
    elem: "laypage",
    count: $("#laypage").data("maxnum"),
    limit: 12,
    groups: 6,
    curr: location.pathname.replace("/page/", ""),
    jump: function(obj, first){      
      $('#laypage a').each((i ,v) => {
          let pageValue = `/page/${$(v).data('page')}` 
          v.href = pageValue
      })    
    }
  }) 

  carousel.render({
    elem: '#test1'
    ,width: '100%' //设置容器宽度
    ,height: '350px'
    ,arrow: 'hover' //始终显示箭头
  })

})