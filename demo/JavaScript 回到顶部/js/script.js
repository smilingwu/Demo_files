/**
 *script.js
 * @authors Your Name (you@example.org)
 * @date    2016-11-22 23:18:23
 * @version $Id$
 */
//页面加载完成毕后触发
window.onload=function(){
    var obtn=document.getElementById('btn');
    var clientHeight=document.documentElement.clientHeight;
    var timer=null;
    var isTop=true;
    //滚动条滚动时触发
    window.onscroll=function(){
        var osTop=document.documentElement.scrollTop || document.body.scrollTop;
        if(osTop>=clientHeight){
            obtn.style.display='block';
        }
        else{
            obtn.style.display='none';
        }
        if(!isTop){
            clearInterval(timer);
        }
        isTop=false;
    }
    obtn.onclick=function(){
        //alert(clientHeight);
        //设置定时器
        timer=setInterval(function(){
            //获取滚动条距离顶部的高度
            var osTop=document.documentElement.scrollTop || document.body.scrollTop;
            var ispeed=Math.floor(-osTop/3);
            document.documentElement.scrollTop=document.body.scrollTop=osTop+ispeed;
            isTop=true;
            //console.log(osTop-ispeed);
            if(osTop==0){
                clearInterval(timer);
            }
        },30);
    }
}

