var main = {
    init: function(obj){
        var _this = this;
        _this.addRootTemp(obj);
        _this.addEvent(obj);
    },
    addRootTemp: function(obj){
        var tempStr = ''+
            '<div class="goods-sku control-group">'+
                '<label>商品价格</label>'+
                '<div class="sku-region">'+
                    '<div class="sku-group">'+
                        '<div class="js-sku-list-container"></div>'+
                        '<div class="js-sku-group-opts">'+
                            '<h3 class="sku-group-title">'+
                                '<button type="button" class="js-add-sku-group btn">添加规格项目</button>'+
                            '</h3>'+
                        '</div>'+
                    '</div>'+
                '</div>'+
            '</div>'+
            '<div class="goods-stock control-group" style="display: block;">'+
                '<label class="control-label">商品库存：</label>'+
                    '<div id="stock-region" class="controls sku-stock">'+
                        '<table class="table-sku-stock">'+
                        '<thead></thead>'+
                        '<tbody></tbody>'+
                    '</table>'+
                '</div>'+
            '</div>';
        obj.append(tempStr);
    },
    addEvent: function(obj){
        var _this = this;
        obj.on("click", ".js-add-sku-group", function(){
            var len = $(".js-sku-list-container").find(".sku-sub-group").length;
            if(len == 0){
                $(".js-sku-list-container").append(_this.groupStr());
                _this.addImgSwitch();
            }else{
                $(".js-sku-list-container").append(_this.groupStr());
                if(len == 2){
                    $(this).parents(".js-sku-group-opts").hide();
                }
            }
            _this.addSelect2(obj.find(".sku-sub-group:last").find(".js-sku-name"));
        });

        obj.on("change", ".js-sku-name", function (e) {
            var $parent = $(this).parents(".sku-group-title");
            var $addContainer = $parent.siblings(".js-sku-atom-container");
            $addContainer.html(_this.addStr());
        });
        obj.on("click", ".js-add-sku-atom", function(){
            window.selections = "";
            _this.showPop($(this));
        });

        $("body").on("select2:select", ".js-sku-name,.js-select2", function (e) {
            var input = $(this).siblings("input");
            var defaultVal = input.val();
            var defaultName = input.attr("data-name");
            var selectObj = _this.selectData("select2:select", e);
            if(defaultVal != "" && input.attr("name") != "sku_name"){
                input.val(defaultVal+","+selectObj.id).attr("data-name", defaultName+","+selectObj.text);
            }else{
                input.val(selectObj.id).attr("data-name", selectObj.text);
            }
        });
        
        obj.on("click", ".remove-sku-group", function(){
            $(this).parents(".sku-sub-group").remove();
            if($(".sku-sub-group").length < 3) $(".js-sku-group-opts").show();
            _this.addImgSwitch();
            _this.updateTable();
        });

        obj.on("click", ".atom-close", function(){
            $(this).parent().remove();
            _this.updateTable();
        });

        obj.on("click", "#js-addImg-function", function () {
            var $skuGroup = $(this).parents(".sku-sub-group");
            $skuGroup.find(".upload-img-wrap").toggleClass("hide");
            $skuGroup.find(".sku-atom").toggleClass("active");
        });

        obj.on("click", ".js-btn-add", function(){
            var $file = $(this).siblings("input[type=file]");
            $file.trigger("click");
        });

        obj.on("change", "input[name=add-image-file]", function(){
            // 上传图片
            alert($(this).val());
        });

        obj.on("blur", "#stock-region .js-price", function(){
            _this.validate($(this), "price");
        });

        obj.on("blur", "#stock-region .js-stock-num", function(){
            _this.validate($(this), "stock");
        });
    },
    addSelect2: function(ele){
        _this = this;
        ele.select2({
            placeholder: 'search',
            allowClear: true,
            multiple: false,
            tokenSeparators: [','],
            data: {
                results: nameDataList,
                text: 'text'
            },
            initSelection: function (element, callback) {
                console.log()
                var data = [];
                $(element.val().split(",")).each(function (i) {
                    var o = _this.findWithAttr(nameDataList, 'id', this);
                    if (o) {
                        data.push({
                            id: o.id,
                            text: o.text
                        });
                    } else {
                        console.log("findWithAttr returned none; likely invalid id");
                    }
                });
                console.log("data = " + JSON.stringify(data));
                callback(data);
            },
            createSearchChoice: function (term, data) {
                console.log("create");
                if ($(data).filter(function () {
                    return this.text.localeCompare(term) === 0;
                }).length === 0) {
                    return {
                        id: -1,
                        text: term
                    };
                }
            },
            formatSelection: _this.format,
            formatResult: _this.format
        }).on("change", function (e) {
            console.log("change " + JSON.stringify({
                val: e.val,
                added: e.added,
                removed: e.removed
            }));

            if (e.added) {
                //alert('added: ' + e.added.text + ' id ' + e.added.id);
            } else if (e.removed) {
                //alert('removed: ' + e.removed.text + ' id ' + e.removed.id);
            }
            $(".js-cancel").trigger("click");
            var selections = (JSON.stringify($(this).select2('data')));
            var selectList = $.parseJSON(selections);
            $(this).attr({"data-name": selectList.text, "data-id": selectList.id})
        });
    },
    format: function(item) {
        return item.text;
    },
    findWithAttr: function(array, attr, value) {
        for (var i = 0; i < array.length; i += 1) {
            if (array[i][attr] == value) {
                return array[i];
            }
        }
    },
    validate: function(obj, type){
        var _this = this;
        var val = obj.val();
        var $td= obj.parent("td");
        if($.trim(val) == ""){
            if(type == "price"){
                obj.val("0.00");
                _this.addErrorText(obj, $td, "价格最小为 0.01");
            }else if(type == "stock"){
                _this.addErrorText(obj, $td, "库存不能为空");
            }
            return;
        }else if(isNaN(val)){
            obj.val("NaN");
            _this.addErrorText(obj, $td, "请输入一个数字");
            return;
        }else if(val == 0 && type == "price"){
            obj.val("0.00");
            _this.addErrorText(obj, $td, "价格最小为 0.01");
            return;
        }
        $td.removeClass("manual-valid-error");
        $td.find(".error-message").hide();
    },
    addErrorText: function(obj, parent, text){
        parent.addClass("manual-valid-error");
        if(obj.siblings(".error-message").length > 0){
            parent.find(".error-message").text(text).show();
        }else{
            parent.append('<div class="error-message">'+ text +'</div>');
        }
    },
    addStr: function(argument) {
        var html = '<div class="js-sku-atom-list sku-atom-list"></div><a href="javascript:;" class="js-add-sku-atom add-sku">+添加</a><input type="hidden" name="sku-atom-list" />';
        return html;
    },
    showPop: function(obj){
        var _this = this;
        var popStr = ''+
            '<div class="ui-popover top-center">'+
                '<div class="ui-popover-inner" style="width: 350px;">'+
                    // '<select class="select2-atom-container" value="" multiple="multiple" style="width: 240px;"></select>'+
                    '<input type="hidden" class="js-select2 select2-offscreen" style="width: 242px;" tabindex="-1">'+
                    '<button class="ui-btn ui-btn-primary js-save" style="vertical-align: top">确定</button>'+
                    '<button class="ui-btn js-cancel" style="vertical-align: top">取消</button>'+
                '</div>'+
                '<div class="arrow"></div>'+
            '</div>';
        var $body = $("body");
        var $pop = $(popStr);
        var top = obj.offset().top + 20;
        var left = obj.offset().left - 175;
        $body.append($pop);
        $pop.css({"top": top, "left": left});
        var $skuAtomList = obj.siblings(".sku-atom-list");
        var nameId = obj.parents(".sku-sub-group").find("input[name=sku_name]").val();
        var specId = "WX_SPEC_ID_"+nameId;
        var specList = datas.intables.wx_specitem[specId];
        var specDataList = [];
        if(specList != undefined){
            for(var i = 0; i < specList.length; i++){
                specDataList.push({id: specList[i].id, text: specList[i].form_name});
            }
        }

        var $selectContainer = $pop.find(".js-select2");
        $selectContainer.select2({
            placeholder: 'search',
            allowClear: true,
            multiple: true,
            tokenSeparators: [','],
            data: {
                results: specDataList,
                text: 'text'
            },
            initSelection: function (element, callback) {
                var data = [];
                $(element.val().split(",")).each(function (i) {
                    var o = _this.findWithAttr(specDataList, 'id', this);
                    if (o) {
                        data.push({
                            id: o.id,
                            text: o.text
                        });
                    } else {
                        console.log("findWithAttr returned none; likely invalid id");
                    }
                });
                console.log("data = " + JSON.stringify(data));
                callback(data);
            },
            createSearchChoice: function (term, data) {                
                console.log("create");
                if ($(data).filter(function () {
                    return this.text.localeCompare(term) === 0;
                }).length === 0) {
                    return {
                        id: (window.index++),
                        text: term
                    };
                }
            },
            formatSelection: _this.format,
            formatResult: _this.format
        }).on("change", function (e) {
            var changeObj = JSON.stringify({
                val: e.val,
                added: e.added,
                removed: e.removed
            });
            changeObj = $.parseJSON(changeObj);
            window.selections = (JSON.stringify($(this).select2('data')));
            if($(this).select2('data').length > changeObj.val.length){
                window.selections = (JSON.stringify($(this).select2('data').splice($(this).select2('data').length-1, 1)));
                $(this).siblings(".select2-container").find(".select2-search-choice:last").remove();
            }
            if (e.added) {
                //alert('added: ' + e.added.text + ' id ' + e.added.id);
            } else if (e.removed) {
                //alert('removed: ' + e.removed.text + ' id ' + e.removed.id);
            }
        }).on("selecting", function (e) {
            alert("5")
        });
        $pop.on("click", ".js-save", function(){            
            if(window.selections != ""){
                debugger
                var oldList = obj.siblings("input[name=sku-atom-list]").attr("data-list");
                if(oldList != "" && oldList != undefined){
                    oldList = $.parseJSON(obj.siblings("input[name=sku-atom-list]").attr("data-list") );
                }else{
                    oldList = [];
                }
                var valList = $.parseJSON(window.selections);
                if(oldList.length > 0){
                    valList = _this.duplicateArr(oldList, valList);
                }
                for(var i = 0; i < valList.length; i++){
                    $skuAtomList.append(_this.skuAtomStr(valList[i].text));
                    oldList.push({id: valList[i].id, text: valList[i].text});
                }
                obj.siblings("input[name=sku-atom-list]").attr("data-list", JSON.stringify(oldList));
                _this.showAddImg();
            }
            _this.updateTable();
            $(this).parents(".ui-popover").remove();
        });
        $pop.on("click", ".js-cancel", function(){
            $(this).parents(".ui-popover").remove();
        });
    },
    duplicateArr: function(oldArr, newArr){
        var result = [];
        for(var i = 0; i < newArr.length; i++){
            var flag = false;
            for(var j = 0; j < oldArr.length; j++){                
                if(newArr[i].id == oldArr[j].id){
                    flag = true;
                }
            }
            if(flag == false){
                result.push({"id": newArr[i].id, "text": newArr[i].text});
            }
        }
        return result;
    },
    skuAtomStr: function(text){
        var skuAtomHtml = ''+
            '<div class="sku-atom"><span>'+ text +'</span>'+
                '<div class="atom-close close-modal small js-remove-sku-atom">×</div>'+
                '<div class="upload-img-wrap hide">'+
                    '<div class="arrow"></div>'+
                    '<div class="js-upload-container" style="position:relative;">'+
                    '<div class="add-image js-btn-add">+</div>'+
                    '<input type="file" name="add-image-file" class="add-image-btn hide" />'
                '</div>'+
            '</div>'+
        '</div>';
        return skuAtomHtml;
    },
    selectData: function (name, evt) {
      if (!evt) {
        var args = "{}";
      } else {
        var args = JSON.stringify(evt.params, function (key, value) {
          if (value && value.nodeName) return "[DOM node]";
          if (value instanceof $.Event) return "[$.Event]";
          return value;
        });
      }
      var dataObj = {id: $.parseJSON(args).data.id, text: $.parseJSON(args).data.text};
      return dataObj;
    },
    groupStr: function(){
        var groupHtml = ''+
            '<div class="sku-sub-group">'+
                '<h3 class="sku-group-title">'+
                    // '<select class="select2-container" value="" style="width: 100px;"></select>'+
                    '<input type="hidden" name="sku_name" class="js-sku-name select2-offscreen" style="width: 100px;" tabindex="-1">'+
                    '<a class="js-remove-sku-group remove-sku-group">×</a>'+
                '</h3>'+
                '<div class="js-sku-atom-container sku-group-cont"></div>'+
            '</div>';
        return groupHtml;
    },
    addImgSwitch: function(){
        var imgSwitchStr = ''+
            '<label for="js-addImg-function" class="addImg-radio">'+
                '<input type="checkbox" id="js-addImg-function">添加规格图片'+
            '</label>';

        var $close = $(".js-sku-list-container").find(".sku-sub-group:first").find(".remove-sku-group");
        if($close.siblings(".addImg-radio").length == 0)
            $(imgSwitchStr).insertBefore($close);
    },
    showAddImg: function(){
        var isShowImg = $("#js-addImg-function").prop("checked");
        if(isShowImg){
            var $skuGroup = $(".js-sku-list-container").find(".sku-sub-group:first");
            $skuGroup.find(".upload-img-wrap").removeClass("hide");
            $skuGroup.find(".sku-atom").addClass("active");
        }
    },
    updateTable: function(){
        // debugger
        var goodsArr = [];
        var $skuGroup = $(".sku-sub-group");
        $skuGroup.each(function(){
            var name = $(this).find("input[name=sku_name]").attr("data-name");
            if(name != "" && name != undefined){
                var list = [];
                var $skuAtom = $(this).find(".sku-atom");
                $skuAtom.each(function(){
                    list.push($(this).find("span").text());
                });
                if(list.length != 0){
                    var skuObj = {"name": name, "list": list};
                    goodsArr.push(skuObj);
                }
            }            
        });
        /*goodsArr = [
            {name: "颜色", list: ["黑色", "白色", "蓝色"]},
            {name: "款式", list: ["新款", "爆款"]},
            {name: "尺寸", list: ["L", "M"]}
        ];*/
        var $table = $(".table-sku-stock");
        var $thead = $table.find("thead");
        var $tbody = $table.find("tbody");
        var nameStr = '';
        var tbodyStr = '';
        var listStrArr = [];
        var list1StrArr = [],list2StrArr = [],list3StrArr = [];
        var defaultStr = ''+
            '<td><input type="text" name="code" class="js-code input-small" value=""></td>'+
            '<td><input type="text" name="stock_num" class="js-stock-num input-mini" value="" maxlength="9"></td>'+
            '<td><input data-stock-id="0" type="text" name="tag_price" class="js-price input-mini" value="" maxlength="10"></td>'+
            '<td><input data-stock-id="0" type="text" name="market_price" class="js-price input-mini" value="" maxlength="10"></td>'+
            '<td><input data-stock-id="0" type="text" name="specification" value="" maxlength="10"></td>'+
            '<td><input data-stock-id="0" type="text" name="weight" value="" maxlength="10"></td>';
        var goodsData2 = [];
        for(var i = 0; i < goodsArr.length; i++){
            var list = goodsArr[i].list;
            goodsData2.push(goodsArr[i].id);
            for(var j = 0; j < list.length; j++){

            }
        }
        goodsArr.reverse();
        for(var i = 0; i < goodsArr.length; i++){
            nameStr = '<th class="text-center">'+ goodsArr[i].name +'</th>' + nameStr;
            var list = goodsArr[i].list;
            for(var j = 0; j < list.length; j++){
                if(i == 0){
                    list1StrArr.push('<td rowspan="1">'+ list[j] +'</td>' + defaultStr);
                    listStrArr = list1StrArr;
                }else if(i == 1){
                    for(var m = 0; m < list1StrArr.length; m++){
                        if(m == 0){
                            list2StrArr.push('<td rowspan="'+ list1StrArr.length +'">'+ list[j] +'</td>' + list1StrArr[m]);
                        }else{
                            list2StrArr.push(list1StrArr[m]);
                        }
                    }
                    listStrArr = list2StrArr;
                }else if(i == 2){
                    for(var m = 0; m < list2StrArr.length; m++){
                        if(m == 0){
                            list3StrArr.push('<td rowspan="'+ list2StrArr.length +'">'+ list[j] +'</td>' + list2StrArr[m]);
                        }else{
                            list3StrArr.push(list2StrArr[m]);
                        }
                    }
                    listStrArr = list3StrArr;
                }
            }
        }

        for(var n = 0; n < listStrArr.length; n++){
            listStrArr[n] = '<tr>' + listStrArr[n] + '</tr>';
        }   

        var theadHtml = '<tr>'+ nameStr +
            '<th class="th-code">商家编码</th>'+
            '<th class="th-stock">库存</th>'+
            '<th class="th-tag-price">吊牌价（元）</th>'+
            '<th class="th-market-price">市场价（元）</th>'+
            '<th class="th-specification">规格描述</th>'+
            '<th class="th-weight">商品重量</th></tr>';
        $thead.html(theadHtml);
        $tbody.html(listStrArr.join());
    }
}
$(function(){
    main.init($("#goods-wrapper"));
    getNameData();
    window.index = 10;
    window.goodsData = [];
});

function nameData(Datas){
    var dataList = [];
    var Datas = {"code":"0","message":"success","data":{"recordscount":3,"totalpages":1,"list":[{"id":10,"code":"Type","name":"类型","isactive__dk":"是","isactive":"Y"},{"id":9,"code":"size","name":"尺寸","isactive__dk":"是","isactive":"Y"},{"id":8,"code":"Z001","name":"颜色","isactive__dk":"是","isactive":"Y"}],"intables":{"wx_specitem":{"WX_SPEC_ID_8":[{"id":23,"code":"a001","form_name":"红色","wx_spec_id":8,"wx_spec_id__dk":"颜色","isactive__dk":"是","isactive":"Y"},{"id":24,"code":"a003","form_name":"蓝色","wx_spec_id":8,"wx_spec_id__dk":"颜色","isactive__dk":"是","isactive":"Y"}],"WX_SPEC_ID_9":[{"id":25,"code":"27","form_name":"27","wx_spec_id":9,"wx_spec_id__dk":"尺寸","isactive__dk":"是","isactive":"Y"},{"id":26,"code":"28","form_name":"28","wx_spec_id":9,"wx_spec_id__dk":"尺寸","isactive__dk":"是","isactive":"Y"}]}}}};
    //window.datas = $.parseJSON(Datas).data;
    window.datas = Datas.data;
    var list = datas.list;
    for(var i = 0; i < list.length; i++){
        dataList.push({id: list[i].id, text: list[i].name});
    }
    window.nameDataList = dataList;
}

function getNameData(){
    var url = 'http://service.exfox.com.cn/apiproxy/service.aspx?method=pc/getjsonarray';
    var param = {
        "ltconfig":"WX_SPEC",                                //商品规格表
        "pagenow":0,
        "pagesize":20,
        "mask":4,
        "condition":"WX_PUBLIC_ID==21",        //所属公众号，获取页面sessionStorage
        "intables":[{
            "ltconfig":"WX_SPECITEM",           //商品规格明细表
            "refcolumn":"WX_SPEC_ID",           //关联到主表的字段
            "type":"list",  //返回数据方式（列表、对象），可为空，默认值list
            "mask":4
        }]
    };
    postData(param, url);
}

function postData(param, url){
    $.ajax({
        type:"post",
        beforeSend: function(xhr) {
            console.log('请求前');
        },
        url: url,
        async:true,
        data: JSON.stringify(param),
        success:function(data){
            nameData(JSON.stringify(data));
        },
        error: function(data){
            alert(JSON.stringify(data));
        }
    });
}