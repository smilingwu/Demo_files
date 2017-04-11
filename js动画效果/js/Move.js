function getStyle(obj, attr){
    if(obj.currentStyle)    {
        return obj.currentStyle[attr];
    }else{
        return getComputedStyle(obj, false)[attr];
    }
}
function startMove(obj,json,fn){
    //停止上一次定时器
    clearInterval(obj.timer);
    //保存每一个物体运动的定时器
    obj.timer = setInterval(function(){
        //判断同时运动标志
        var flag = true;
        for(var attr in json){
            //取当前值
            var iCur = 0;
            if(attr == 'opacity'){
                iCur = parseInt(parseFloat(getStyle(obj, attr))*100);
            }else{
                iCur = parseInt(getStyle(obj,attr));
            }
            //计算速度
            var iSpeed = (json[attr] - iCur) / 8;
            iSpeed = iSpeed > 0 ? Math.ceil(iSpeed) : Math.floor(iSpeed);
            //检测同时到达标志
            if(iCur != json[attr]){
                flag = false;
            }
            //更改属性，获取动画效果
            if(attr=='opacity'){
                iCur += iSpeed;
                obj.style.filter='alpha(opacity:' + iCur + ')';
                obj.style.opacity=iCur / 100;
            }
            else{
                obj.style[attr]=iCur+iSpeed+'px';
            }
        }
        //检测停止
        if(flag){
            clearInterval(obj.timer);
            if(fn) fn();
        }
    },30)
}
