layui.use(['element', 'laypage'], function(){
  let element = layui.element,
      laypage = layui.laypage,
      $ = layui.$
  
  element.tabDelete('demo', 'xxx')


  laypage.render({
    elem: "laypage",
    count: $("#laypage").data("maxnum"),
    limit: 8,
    groups: 5,
    curr: location.pathname.replace("/page/", ""),
    jump: function(obj, first){      
      $('#laypage a').each((i ,v) => {
          let pageValue = `/page/${$(v).data('page')}` 
          v.href = pageValue
      })    
    }
  }) 
})