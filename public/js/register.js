layui.use(['element', "layer"], function(){
  const element = layui.element;
  const layer = layui.layer
  const $ = layui.$

  //$submit = $(".layui-show button[type!=reset]")
  let $username = $(".layui-show input[name=username]")
  let $password = $(".layui-show input[name=password]")
  let $password2 = $(".layui-show input[name=confirmPWD]")
  let $yanzhen = $(".layui-show button[lay-filter='formDemo']")

  $username.on("input", () => {
    let username = $username.val()
    if(username.length > 6){
      layer.msg('用户名过长',{icon: 7,offset:'120px'});
    }
  })

  // 失去焦点
  $password2.on("blur", function(){
    const pwd = $password.val()
    if($(this).val() !== pwd){
      layer.msg('两次输入的密码不一样',{icon: 7,offset:'120px'});
      $(this).val("")
    }
  })
  // console.log($(".sub_btn").value)
 // canvas 验证码
  $(function(){
    let show_num = [];
    draw(show_num);

    $("#canvas").on('click',function(){
        draw(show_num);
    })
    $yanzhen.on('click',function(){
        let val = $(".input-val").val().toLowerCase();
        console.log(val)
        let num = show_num.join("");
        if(val !== num){
            layer.msg('验证码不正确',{icon: 5 , offset: '120px'});
            $(".input-val").val('');
            draw(show_num);
        }
    })
  })

  function draw(show_num) {
    let canvas_width=$('#canvas').width();
    let canvas_height=$('#canvas').height();
    let canvas = document.getElementById("canvas");//获取到canvas的对象，演员
    let context = canvas.getContext("2d");//获取到canvas画图的环境，演员表演的舞台
    canvas.width = canvas_width;
    canvas.height = canvas_height;
    let sCode = "A,B,C,E,F,G,H,J,K,L,M,N,P,Q,R,S,T,W,X,Y,Z,1,2,3,4,5,6,7,8,9,0";
    let aCode = sCode.split(",");
    let aLength = aCode.length;//获取到数组的长度
    
    for (let i = 0; i <= 3; i++) {
      let j = Math.floor(Math.random() * aLength);//获取到随机的索引值
      let deg = Math.random() * 30 * Math.PI / 180;//产生0~30之间的随机弧度
      let txt = aCode[j];//得到随机的一个内容
      show_num[i] = txt.toLowerCase();
      let x = 10 + i * 20;//文字在canvas上的x坐标
      let y = 20 + Math.random() * 8;//文字在canvas上的y坐标
      context.font = "bold 23px 微软雅黑";

      context.translate(x, y);
      context.rotate(deg);

      context.fillStyle = randomColor();
      context.fillText(txt, 0, 0);

      context.rotate(-deg);
      context.translate(-x, -y);
    }
    for (let i = 0; i <= 5; i++) { //验证码上显示线条
      context.strokeStyle = randomColor();
      context.beginPath();
      context.moveTo(Math.random() * canvas_width, Math.random() * canvas_height);
      context.lineTo(Math.random() * canvas_width, Math.random() * canvas_height);
      context.stroke();
    }
    for (let i = 0; i <= 30; i++) { //验证码上显示小点
      context.strokeStyle = randomColor();
      context.beginPath();
      let x = Math.random() * canvas_width;
      let y = Math.random() * canvas_height;
      context.moveTo(x, y);
      context.lineTo(x + 1, y + 1);
      context.stroke();
    }
  }

  function randomColor() {//得到随机的颜色值
    let r = Math.floor(Math.random() * 256);
    let g = Math.floor(Math.random() * 256);
    let b = Math.floor(Math.random() * 256);
    return "rgb(" + r + "," + g + "," + b + ")";
  }
});