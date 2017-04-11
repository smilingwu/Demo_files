window.onload=function(){
    var ogo=document.getElementById('go');
    var obox=document.getElementById('box');
    eventUtil.addHandler(obox,'click',function(){
        alert('我是整个父盒子');
    });
    eventUtil.addHandler(ogo,'click',function(e){
        //e=e || window.event;//第一种书写方式
        e=eventUtil.getEvent(e);//第二种书写方式
        //alert(e);
        alert(eventUtil.getElement(e).nodeName);
        eventUtil.preventDefault(e);
        eventUtil.stopPropagation(e);
    })
}
