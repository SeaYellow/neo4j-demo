  // create an array with nodes
  var nodes , edges , pmsNodes , pmsEdges , network , pmsNetwork,
  cNodes,cEdges,cNetwork,legend,pmslegend,clegend;
  var diffFlag = false;
  var borderWidth = 5;
  var selectedSize = 40;
  var sameData;
  var hiddenNodes = [] ;
var initNetWork = function(){
    //获取承载图的div标签对象
    var container = document.getElementById('network');
    var pmsContainer = document.getElementById('pmsNetwork');
    var cContainer = document.getElementById('cNetwork');
    //vis图的配置项。
    var options = {
        highlightNearest:true,
        nodes: {
            shape: 'dot',
            size: 20,
            font: {
                size: 15
            }
        },
        edges: {
            width: 2,
            selectionWidth: function (width) {return width*2;},
            font: {align: 'middle'},
            label: ''

        },
        groups: {
            TRAN: {
                size: 20,
                color: {background:'#68BDF6',border:'#5CA8DB'},
                chosen: { label: false, node: function(values, id, selected, hovering){
                    values.color = '#CCFFFF';
                    values.borderColor = '#0066FF';
                    values.size = selectedSize;
                    values.borderWidth = borderWidth;
                } }
            },
            LINES: {
                size: 20,
                color: {background:'#FB95AF',border:'#E0849B'},
                chosen: { label: false, node: function(values, id, selected, hovering){
                    values.color = '#FFCCFF';
                    values.borderColor = '#FF66FF';
                    values.size = selectedSize;
                    values.borderWidth = borderWidth;
                }}

            },
            SUBS: {
                size: 20,
                color: {background:'#FF756E',border:'#E06760'},
                chosen: { label: false, node: function(values, id, selected, hovering){
                    values.color = '#FFCCCC';
                    values.borderColor = '#FF9999';
                    values.size = selectedSize;
                    values.borderWidth = borderWidth;
                }}
            },
            PMS_TRAN: {
                size: 20,
                color: {background:'#68BDF6',border:'#5CA8DB'},
                chosen: { label: false, node: function(values, id, selected, hovering){
                    values.color = '#CCFFFF';
                    values.borderColor = '#0066FF';
                    values.size = selectedSize;
                    values.borderWidth = borderWidth;
                }}
            },
            PMS_LINES: {
                size: 20,
                color: {background:'#FB95AF',border:'#E0849B'},
                chosen: { label: false, node: function(values, id, selected, hovering){
                    values.color = '#FFCCFF';
                    values.borderColor = '#FF66FF';
                    values.size = selectedSize;
                    values.borderWidth = borderWidth;
                }}
            },
            PMS_SUBS: {
                size: 20,
                color: {background:'#FF756E',border:'#E06760'},
                chosen: { label: false, node: function(values, id, selected, hovering){
                    values.color = '#FFCCCC';
                    values.borderColor = '#FF9999';
                    values.size = selectedSize;
                    values.borderWidth = borderWidth;
                }}
            },
            DIFF:{
                size:20,
                color: {background:'#FFFF33',border:'#FFCC66'},
                chosen: { label: false, node: function(values, id, selected, hovering){
                    values.color = '#FFFFCC';
                    values.borderColor = '#FFFF66';
                    values.size = selectedSize;
                    values.borderWidth = borderWidth;
                }}
            },
            HIDDEN:{
                hidden:true
            }
        },
        physics: {
            stabilization: false
        },
        interaction: {
            tooltipDelay: 200,
            //拖曳时是否隐藏路径
            hideEdgesOnDrag: false
        },
        manipulation: {
            locale:'ch_yx',
            addNode: function (data, callback) {
                // filling in the popup DOM elements
                document.getElementById('operation').innerHTML = "Add Node";
                document.getElementById('node-id').value = data.id;
                document.getElementById('node-label').value = data.label;
                document.getElementById('saveButton').onclick = saveData.bind(this, data, callback);
                document.getElementById('cancelButton').onclick = clearPopUp.bind();
                document.getElementById('network-popUp').style.display = 'block';
            },
            editNode: function (data, callback) {
                // filling in the popup DOM elements
                document.getElementById('operation').innerHTML = "Edit Node";
                document.getElementById('node-id').value = data.id;
                document.getElementById('node-label').value = data.label;
                document.getElementById('saveButton').onclick = saveData.bind(this, data, callback);
                document.getElementById('cancelButton').onclick = cancelEdit.bind(this,callback);
                document.getElementById('network-popUp').style.display = 'block';
            },
            addEdge: function (data, callback) {
                if (data.from == data.to) {
                    var r = confirm("Do you want to connect the node to itself?");
                    if (r == true) {
                    }
                    callback(data);
                }
                else {
                    callback(data);
                }
            }
        },
    };
    // legend = [];
    // var step = 70;
    // legend.push({id: 'LSUB', x: x, y: y, label: 'Internet', group: 'internet', value: 1, fixed: true, physics:false});
    // legend.push({id: 'LLINE', x: x, y: y + step, label: 'Switch', group: 'switch', value: 1, fixed: true,  physics:false});
    // legend.push({id: 'LTRAN', x: x, y: y + 2 * step, label: 'Server', group: 'server', value: 1, fixed: true,  physics:false});
    // legend.push({id: 'LDIFF', x: x, y: y + 3 * step, label: 'Computer', group: 'desktop', value: 1, fixed: true,  physics:false});
    //图的节点和边数据
    //DataSet可直接将对象数组传入生成图，生成的图会自动调整节点位置以及缩放比例，但需要一定的加载时间
    //此处采用的方式是，初始化一个没有节点和边的空图，之后用增加节点的方式生成图，可大幅缩短加载时间
    nodes = new vis.DataSet([]);
    edges = new vis.DataSet([]);
    pmsNodes = new vis.DataSet([]);
    pmsEdges = new vis.DataSet([]);
    cNodes = new vis.DataSet([]);
    cEdges = new vis.DataSet([]);
    data = {
        nodes: nodes,
        edges: edges
    };
    pmsData = {
        nodes : pmsNodes,
        edges : pmsEdges
    };
    cData = {
        nodes : cNodes,
        edges : cEdges
    }
    network = new vis.Network(container, data, options);
    options.manipulation.locale='ch_sc';
    pmsNetwork =new vis.Network(pmsContainer, pmsData, options);
    options.manipulation.locale='ch_hb';
    cNetwork =new vis.Network(cContainer, cData, options);
    //单击事件
    network.on("click", function (params) {
        networkClick(params,network);
    });
    pmsNetwork.on("click", function (params) {
        networkClick(params,pmsNetwork);
    });
    cNetwork.on("click", function (params) {
        networkClick(params,cNetwork);
    });
    //双击事件
    network.on("doubleClick", function (params) {
        networkDoubleClick(params,nodes,edges);
    });
    pmsNetwork.on("doubleClick", function (params) {
        networkDoubleClick(params,pmsNodes,pmsEdges);
    });
    cNetwork.on("doubleClick", function (params) {
        networkDoubleClick(params,cNodes,cEdges);
    });

}
//发送请求，获取节点和边的数据
  var startNetwork = function(param) {
      $.ajax({
               url: '/electric/queryByCql',
               data:param,
               type: 'POST',
               success: function(data){
                loadData(data);
                   hideWeChat();
               },
               dataType: "json"
       });
  }
//将所得节点放入图中，根据节点数量调整缩放比例
  var loadData = function(responseData){
       nodes = new vis.DataSet([]);
       edges = new vis.DataSet([]);
       network.setData({
           nodes:nodes,
           edges:edges
       });

       pmsNodes = new vis.DataSet([]);
       pmsEdges = new vis.DataSet([]);
       pmsNetwork.setData({
           nodes:pmsNodes,
           edges:pmsEdges
       });

       cNodes = new vis.DataSet([]);
       cEdges = new vis.DataSet([]);
       cNetwork.setData({
          nodes:cNodes,
          edges:cEdges
       });
       eData = JSON.parse(responseData.yxData.eData);
       vData = JSON.parse(responseData.yxData.vData);

       pmseData = JSON.parse(responseData.scData.eData);
       pmsvData = JSON.parse(responseData.scData.vData);

       nodes.add(vData);
       edges.add(eData);

       pmsNodes.add(pmsvData);
       pmsEdges.add(pmseData);

       if(vData.length <= 400){
           network.body.view.scale = 0.2;
       }else if(400 < vData.length && vData.length <= 1000){
           network.body.view.scale = 0.2;
       }else if(1000 < vData.length && vData.length <= 1500){
           network.body.view.scale = 0.1;
       }else if(1500 < vData.length){
           network.body.view.scale = 0.09;
       }

       if(pmsvData.length <= 400){
           pmsNetwork.body.view.scale = 0.2;
       }else if(400 < pmsvData.length && pmsvData.length <= 1000){
           pmsNetwork.body.view.scale = 0.2;
       }else if(1000 < pmsvData.length && pmsvData.length <= 1500){
           pmsNetwork.body.view.scale = 0.1;
       }else if(1500 < pmsvData.length){
           pmsNetwork.body.view.scale = 0.09;
       }
  }

  // var refresh = function(){
  //   startNetwork();
  // };
  //单击搜索按钮，生成图
  var restart = function(){
//       if(valid()){
       WeChatShow();
       var subName = $.trim($('#electricity').val());
       var param = {
           "subName":subName
       };
       diffFlag = false;
       $('#subNameId').val(subName);
       startNetwork(param);
//       }

  };
  // function prevent(e) {
  //     e.preventDefault ? e.preventDefault() : e.returnValue = false;
  // }
  // function digitInput(el, e) {
  //     var ee = e || window.event; // FF、Chrome IE下获取事件对象
  //     var c = e.charCode || e.keyCode; //FF、Chrome IE下获取键盘码
  //     //var txt = $('label').text();
  //     //$('label').text(txt + ' ' + c);
  //     var val = el.val();
  //     if (c == 110 || c == 190){ // 110 (190) - 小(主)键盘上的点
  //         (val.indexOf(".") >= 0 || !val.length) && prevent(e); // 已有小数点或者文本框为空，不允许输入点
  //     } else {
  //         if ((c != 8 && c != 46 && // 8 - Backspace, 46 - Delete
  //             (c < 37 || c > 40) && // 37 (38) (39) (40) - Left (Up) (Right) (Down) Arrow
  //             (c < 48 || c > 57) && // 48~57 - 主键盘上的0~9
  //             (c < 96 || c > 105)) // 96~105 - 小键盘的0~9
  //             || e.shiftKey) { // Shift键，对应的code为16
  //             prevent(e); // 阻止事件传播到keypress
  //         }
  //     }
  // }
  $(function(){
      initNetWork();
  });
  // function valid(){
  //     var electricity = $.trim($("input[name=electricity]").val());
  //     if (electricity == ''){
  //         $("#errorMsg").css("display",'');
  //        return false;
  //     }
  //     $("#errorMsg").css("display",'none');
  //     return true;
  // }

  //图标操作相关逻辑
  function clearPopUp() {
      document.getElementById('saveButton').onclick = null;
      document.getElementById('cancelButton').onclick = null;
      document.getElementById('network-popUp').style.display = 'none';
  }

  function cancelEdit(callback) {
      clearPopUp();
      callback(null);
  }

  function saveData(data,callback) {
      data.id = document.getElementById('node-id').value;
      data.label = document.getElementById('node-label').value;
      clearPopUp();
      callback(data);
  }
  //输入框回车事件
  function getKey(){
      if(event.keyCode == '13'){
          restart();
      }
  }
  // var closeMsg = function(){
  //     $("#errorMsg").css("display","none");
  // }
  //差异比较逻辑
  var difAnalysis = function(){
      WeChatShow();
      var subName = $("#subNameId").val();
      var param = {
          subName : subName
      };
      $.ajax({
          url: '/electric/difAnalysis',
          data: param,
          type: 'POST',
          success: function(data){
              debugger;
              loadData(data);
              diffFlag = true;
              hideWeChat();
          },
          dataType: "json"
      });
  }
//跨系统匹配逻辑
 var combine = function(){
     WeChatShow();
     mergeGraph(network,pmsNetwork);
     hideWeChat();
 }
