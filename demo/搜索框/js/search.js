/**
 * search.js(原生JavaScript实现)
 * @authors Your Name (you@example.org)
 * @date    2016-11-23 17:09:55
 * @version $Id$
 */
//注意封装常用的函数
//封装获取id的函数
var getDOM=function(id){
    return document.getElementById(id);
}

var addEvent=function(id,event,fn){
    var el=getDOM(id) ||document;
    if (el.addEventListener) {
        el.addEventListener(event,fn,false); //适用于非ie浏览器
    }
    else if(el.attachEvent){
        el.attachEvent('on'+event,fn);//适用于ie浏览器 适用的事件onclick,onkeyup,onkeydown等方法。
    }
}
//addEvent可以为一个dom元素绑定多个事件
//console.log(addEvent('form-search','click',function(){alert(1)}));
//console.log(addEvent('form-search','click',function(){alert(2)}));
//document.getElementById('form-search').onclick无法为一个dom元素绑定多个事件
//console.log(document.getElementById('form-search').onclick=function(){alert(1)});
//console.log(document.getElementById('form-search').onclick=function(){alert(2)});

//取一个元素到浏览器左边的距离
var getElementLeft=function(element){
    var actualLeft=element.offsetLeft;
    var current=element.offsetParent;
    while(current!=null){
        actualLeft+=current.offsetLeft;
        current=current.offsetParent;
    }
    return actualLeft;
}
//取一个元素到浏览器顶部的距离
var getElementTop=function(element){
    var actualTop=element.offsetTop;
    var current=element.offsetParent;
    while(current!=null){
        actualTop+=current.offsetTop;
        current=current.offsetParent;
    }
    return actualTop;
}

var AjaxGet=function(url,callback){
    var _xhr=null;
    if(window.XMLHttpRequest){
        _xhr=new window.XMLHttpRequest();
    }else if(window.ActiveXObject){
        _xhr=new window.ActiveXObject("Msxml2.XMLHTTP");
    }
    _xhr.onreadystatechange=function(){
        if(_xhr.readyState==4 && _xhr.status==200){
            callback(JSON.parse(_xhr.responseText));
        }
    }
    _xhr.open('get',url,false);
    _xhr.send(null);
}
//事件代理
var detegateEvent=function(target,event,fn){
    addEvent(document,event,function(e){
        //当发现用户点击的元素和当前元素的名称一样时就会触发相应的事件
        if(e.target.nodeName==target.toUpperCase()){
            fn.call(e.target);
        }
    });
}
addEvent('search-input','keyup',function(){
    var searchText=getDOM('search-input').value;
    AjaxGet('http://api.bing.com/qsonhs.aspx?q=+searchText',function(d){
            var d=d.AS.Results[0].Suggests;
            var html='';//用一个变量来保存动态生成的html结构
            for(var i=0;i<d.length;i++){
                html+='<li>'+d[i].Txt+'</li>';//拼接一下数据
            }
    var _dom=getDOM('suggest-search');
    getDOM('search-result').innerHTML=html;
    _dom.style.top=getElementTop(getDOM('form-search'))+38+'px';//38一定要与搜索框的高度一致
    _dom.style.left=getElementLeft(getDOM('form-search'))+'px';
    _dom.style.position='absolute';
    _dom.style.display='block';
});});

detegateEvent('li', 'click', function() {
  var keyword=this.innerHTML;
  location.href='http://cn.bing.com/search?q='+keyword;
});
