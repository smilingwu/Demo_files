//把方法封装到对象中
    var eventUtil={  //跨浏览器处理程序
        //添加句柄
        addHandler:function(element,type,handler){
            if(element.addEventListener){
                element.addEventListener(type,handler,false);
            }
            else if(element.attachEvent){
                element.attachEvent('on'+type,handler);
            }
            else{
                element['on'+type]=handler;
                //element.onclick===element['on'+click];注意.等价于[]
            }
        },
        //删除句柄
        removeHandler:function(element,type,handler){
            if(element.removeEventListener){
                element.removeEventListener(type,handler,false);
            }
            else if(element.detachEvent){
                element.detachEvent('on'+type,handler);
            }
            else{
                element['on'+type]=null;
                //element.onclick===element['on'+click];注意.等价于[]
            }
        },
        //获取事件来自哪里触发的(ie)
        getEvent:function(event){
            return event?event:window.event;
        },
        //获取事件类型
        getType:function(event){
            return event.type;
        },
        //获取事件目标
        getElement:function(event){
            return event.target || event.srcElement;
        },
        //阻止事件的默认行为
        preventDefault:function(event){
            if(event.preventDefault){
                event.preventDefault();
            }
            else{
                event.returnValue=false;
            }
        },
        //阻止事件冒泡
        stopPropagation:function(event){
            if(event.stopPropagation){
                event.stopPropagation();
            }
            else{
                event.cancelBubble=true;
            }
        }
    }
