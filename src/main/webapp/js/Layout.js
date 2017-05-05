//加载蒙版
var WeChatShow = function(){
    var height = document.body.scrollHeight;
    var width = document.body.scrollWidth;
    var weChatMask = document.getElementById("weChatMask");
    weChatMask.style.display=null;
    weChatMask.style.position="absolute";
    weChatMask.style.zIndex = "8888";
    weChatMask.style.width=width+"px";
    weChatMask.style.height=height+"px";
    weChatMask.style.background="#f5f5f5";
    weChatMask.style.opacity="0.5";
    weChatMask.style.left=0;
    weChatMask.style.top=0;
    var evt = event || window.event;
    var event = getMousePos(evt);
    $("#weChatMask").fakeLoader({
        timeToHide:60000,
        bgColor:"#000000",
        spinner:"spinner3"
    });
}
//隐藏蒙版
var hideWeChat = function(){
    var weChatMask = document.getElementById("weChatMask");
    weChatMask.style.display="none";
}
//
var getMousePos = function(event) {
    var e = event || window.event;
    var scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
    var scrollY = document.documentElement.scrollTop || document.body.scrollTop;
    var x = e.pageX || e.clientX + scrollX;
    var y = e.pageY || e.clientY + scrollY;
    //alert('x: ' + x + '\ny: ' + y);
    return { 'x': x, 'y': y };
}
//数据导出逻辑
var exportDiffCsv = function(){
    WeChatShow();
    var ids = [];
    for(var k in nodes._data){
        if(nodes._data[k].group.indexOf('DIFF') != -1){
            ids[ids.length]= k;
        }
    }

    for(var i in pmsNodes._data){
        if(pmsNodes._data[i].group.indexOf('DIFF') != -1){
            ids[ids.length]= i;
        }
    }
    var subName = $.trim($('#electricity').val());
    downLoadFile({
        url:"/electric/diffExport",
        data:{
            'diffIds':ids,
            'subName':subName
        }
    });
}

var downLoadFile = function (options) {
    var config = $.extend(true, { method: 'post' }, options);
    var $iframe = $('<iframe id="down-file-iframe" />');
    var $form = $('<form target="down-file-iframe" method="' + config.method + '" />');
    $form.attr('action', config.url);
    for (var key in config.data) {
        $form.append('<input type="hidden" name="' + key + '" value="' + config.data[key] + '" />');
    }
    $iframe.append($form);
    $(document.body).append($iframe);
    $form[0].submit();
    $iframe.remove();
    hideWeChat();
}