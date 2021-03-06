/**
 * Created by merit on 2017/4/21.
 */
var  scale, duration, easingFunction;
var highlightActive = false;

var focusOn = function(id,nw) {
    debugger;
    duration = 100;
    scale = 0.7;
    var group;
    var sameId;
    if(network.body.data.nodes._data[id]){
        group = network.body.data.nodes._data[id].group;
        sameId = network.body.data.nodes._data[id].sameId;
    } else if(pmsNetwork.body.data.nodes._data[id]){
        group = pmsNetwork.body.data.nodes._data[id].group;
        sameId = pmsNetwork.body.data.nodes._data[id].sameId;
    } else if(cNetwork.body.data.nodes._data[id]){
        group = cNetwork.body.data.nodes._data[id].group;
        sameId = cNetwork.body.data.nodes._data[id].sameId;
    }
    var options = {
        // position: {x:positionx,y:positiony}, // this is not relevant when focusing on nodes
        scale: scale,
        offset: {x:0,y:0},
        animation: {
            duration: duration,
            easingFunction: 'linear'
        }
    };
    if(!diffFlag){
        nw.focus(id, options);
        return;
    }
    network.unselectAll();
    pmsNetwork.unselectAll();
    cNetwork.unselectAll();
    if(group == "DIFF"){
        var ids = [];
        ids[0] = id;
        if(network.body.data.nodes._data[id]){
            network.focus(id, options);
            network.selectNodes(ids,true);
        }
        if(pmsNetwork.body.data.nodes._data[id]){
            pmsNetwork.focus(id, options);
            pmsNetwork.selectNodes(ids,true);
        }
        if(cNetwork.body.data.nodes._data[id]){
            cNetwork.focus(id, options);
            cNetwork.selectNodes(ids,true);
        }
    } else {
        var networkNodes = network.body.data.nodes._data;
        if(network.body.data.nodes._data[id]){
            network.focus(id, options);
            var selection = network.getSelection();
            var ids = [];
            ids[0] = id;
            network.selectNodes(ids,true);
            var params = {nodes:ids};
            neighbourhoodHighlight(params,nodes,network);
        } else {
            for(i in networkNodes){
                if(networkNodes[i].id == sameId){
                    network.focus(networkNodes[i].id, options);
                    var selection = network.getSelection();
                    var ids = [];
                    ids[0] = networkNodes[i].id;
                    network.selectNodes(ids,true);
                    var params = {nodes:ids};
                    neighbourhoodHighlight(params,nodes,network);
                    break;
                }
            }
        }

        var pmsNetworkNodes = pmsNetwork.body.data.nodes._data;
        if(pmsNetwork.body.data.nodes._data[id]){
            pmsNetwork.focus(id, options);
            var selection = pmsNetwork.getSelection();
            var ids = [];
            ids[0] = id;
            pmsNetwork.selectNodes(ids,true);
            var params = {nodes:ids};
            neighbourhoodHighlight(params,pmsNodes,pmsNetwork);
        } else {
            for(i in pmsNetworkNodes){
                if(pmsNetworkNodes[i].id == sameId){
                    pmsNetwork.focus(pmsNetworkNodes[i].id, options);
                    var selection = pmsNetwork.getSelection();
                    var ids = [];
                    ids[0] = pmsNetworkNodes[i].id;
                    pmsNetwork.selectNodes(ids,true);
                    var params = {nodes:ids};
                    neighbourhoodHighlight(params,pmsNodes,pmsNetwork);
                    break;
                }
            }
        }

        var cNetworkNodes = cNetwork.body.data.nodes._data;
        if(cNetwork.body.data.nodes._data[id]){
             cNetwork.focus(id, options);
             var selection = cNetwork.getSelection();
             var ids = [];
             ids[0] = id;
             cNetwork.selectNodes(ids,true);
             var params = {nodes:ids};
             neighbourhoodHighlight(params,cNodes,cNetwork);
        } else {
            for(i in cNetworkNodes){
                if(cNetworkNodes[i].id == sameId){
                     cNetwork.focus(cNetworkNodes[i].id, options);
                     var selection = cNetwork.getSelection();
                     var ids = [];
                     ids[0] = cNetworkNodes[i].id;
                     cNetwork.selectNodes(ids,true);
                     var params = {nodes:ids};
                     neighbourhoodHighlight(params,cNodes,cNetwork);
                     break;
                 }
             }
        }
    }
}

var mergeGraph = function(yxNetwork,scNetwork){
    document.getElementById("diff_type")[1].selected=true;
    cNodes = new vis.DataSet([]);
    cEdges = new vis.DataSet([]);
    cNetwork.setData({
       nodes:cNodes,
       edges:cEdges
    });
    var yxVData = yxNetwork.body.data.nodes._data;
    var yxEData = yxNetwork.body.data.edges._data;

    var scVData = scNetwork.body.data.nodes._data;
    var scEData = scNetwork.body.data.edges._data;
    var vArray = new Array();
    var eArray = new Array();

    for(yxIndex in yxVData){
        var yxV = yxVData[yxIndex];
        if(yxV.group == "DIFF"){
            continue;
        }
        for(scIndex in scVData){
            var scV = scVData[scIndex];
            if(yxV.sameId == scV.id){
                for(yxEIndex in yxEData){
                    var e = yxEData[yxEIndex];
                    if(e.from == yxV.id){
                        yxEData[yxEIndex].from = scV.id;
                    }else if (e.to == yxV.id){
                        yxEData[yxEIndex].to = scV.id;
                    }
                }
            }
        }
    }

    //添加差异节点和边
    for(yxIndex in yxVData){
        var yxV = yxVData[yxIndex];
        if(yxV.group == "DIFF"){
            vArray[vArray.length] = yxV;
        }
    }
    for(index in scVData){
         vArray[vArray.length] = scVData[index];
    }
    for(index in scEData){
        eArray[eArray.length] = scEData[index];
    }
    for(yxIndex in yxEData){
        var addFlag = true;
        var yxEdge = yxEData[yxIndex];
        for(scIndex in scEData){
            var scEdge = scEData[scIndex];
            if(yxEdge.from == scEdge.from && yxEdge.to == scEdge.to){
                addFlag = false;
            }
        }
        if(addFlag){
            eArray[eArray.length] = yxEData[yxIndex];
        }
    }


    cNodes.add(vArray);
    cEdges.add(eArray);
    if(vArray.length <= 400){
       cNetwork.body.view.scale = 0.2;
   }else if(400 < vArray.length && vArray.length <= 1000){
       cNetwork.body.view.scale = 0.2;
   }else if(1000 < vArray.length && vArray.length <= 1500){
       cNetwork.body.view.scale = 0.1;
   }else if(1500 < vArray.length){
       cNetwork.body.view.scale = 0.09;
   }
}

var neighbourhoodHighlight = function (params, nodesDataset,nw){
    var allNodes = nodesDataset.get({returnType:"Object"});
    // if something is selected:
    if (params.nodes.length > 0) {
        highlightActive = true;
        var i,j;
        var selectedNode = params.nodes[0];
        var degrees = 2;
        // mark all nodes as hard to read.
        for (var nodeId in allNodes) {
            allNodes[nodeId].color = 'rgba(200,200,200,0.5)';
            if (allNodes[nodeId].hiddenLabel === undefined) {
                allNodes[nodeId].hiddenLabel = allNodes[nodeId].label;
                allNodes[nodeId].label = undefined;
            }
        }
        var connectedNodes = nw.getConnectedNodes(selectedNode);
        var allConnectedNodes = [];

        // get the second degree nodes
        for (i = 1; i < degrees; i++) {
            for (j = 0; j < connectedNodes.length; j++) {
                allConnectedNodes = allConnectedNodes.concat(nw.getConnectedNodes(connectedNodes[j]));
            }
        }

        // all second degree nodes get a different color and their label back
        for (i = 0; i < allConnectedNodes.length; i++) {
            allNodes[allConnectedNodes[i]].color = 'rgba(150,150,150,0.75)';
            if (allNodes[allConnectedNodes[i]].hiddenLabel !== undefined) {
                allNodes[allConnectedNodes[i]].label = allNodes[allConnectedNodes[i]].hiddenLabel;
                allNodes[allConnectedNodes[i]].hiddenLabel = undefined;
            }
        }

        // all first degree nodes get their own color and their label back
        for (i = 0; i < connectedNodes.length; i++) {
            allNodes[connectedNodes[i]].color = undefined;
            if (allNodes[connectedNodes[i]].hiddenLabel !== undefined) {
                allNodes[connectedNodes[i]].label = allNodes[connectedNodes[i]].hiddenLabel;
                allNodes[connectedNodes[i]].hiddenLabel = undefined;
            }
        }

        // the main node gets its own color and its label back.
        allNodes[selectedNode].color = undefined;
        if (allNodes[selectedNode].hiddenLabel !== undefined) {
            allNodes[selectedNode].label = allNodes[selectedNode].hiddenLabel;
            allNodes[selectedNode].hiddenLabel = undefined;
        }
    } else if (highlightActive === true) {
        // reset all nodes
        for (var nodeId in allNodes) {
            allNodes[nodeId].color = undefined;
            if (allNodes[nodeId].hiddenLabel !== undefined) {
                allNodes[nodeId].label = allNodes[nodeId].hiddenLabel;
                allNodes[nodeId].hiddenLabel = undefined;
            }
        }
        highlightActive = false
    }

    // transform the object into an array
    var updateArray = [];
    for (nodeId in allNodes) {
        if (allNodes.hasOwnProperty(nodeId)) {
            updateArray.push(allNodes[nodeId]);
        }
    }
    nodesDataset.update(updateArray);
}

var diffSelect = function (){
    var type = $('#diff_type').val();
    if(type == 'none'){
            return ;
        }
    if(hiddenNodes.length > 0){
        cNodes.add(hiddenNodes);
        hiddenNodes = [];
    }
    if(type == 'all'){
        return;
    }
    for(var k in cNodes._data){
        debugger;
        if(cNodes._data[k].group == 'DIFF'){
            if(cNodes._data[k].type != type){
                hiddenNodes[hiddenNodes.length] = cNodes._data[k];
                cNodes.remove(k);
            }
        }
    }
}


var networkClick = function (params,nw){
    document.getElementById('eventSpan').innerHTML ='';
    if(params.nodes.length == 1 ){
        var id = params.nodes[0];
        focusOn(id,nw);
        $.ajax({
            url: '/electric/findById/'+id,
            success: function(data){
                var result = data.N;
                var htmlStr = '';
                for(key in result){
                    var value = $.trim(result[key]);
                    htmlStr += key +':'+value +'</br>';
                }
                document.getElementById('eventSpan').innerHTML = htmlStr;
            },
            dataType: "json"
        });
    } else if (params.nodes.length == 0){
        neighbourhoodHighlight(params,pmsNodes,pmsNetwork);
        highlightActive = true;
        neighbourhoodHighlight(params,nodes,network);
        highlightActive = true;
        neighbourhoodHighlight(params,cNodes,cNetwork);

        network.unselectAll();
        pmsNetwork.unselectAll();
        cNetwork.unselectAll();
    }
}

var networkDoubleClick = function (params,ns,es){
    var size = params.nodes.length;
    var id ;
    if(size ==1){
        id = params.nodes[0];
        var excIds = '';
        for(i =0;i<params.edges.length;i++){
            var _from = es._data[params.edges[i]].from;
            var _to = es._data[params.edges[i]].to;
            excIds+=id+',';
            if(_from == id){
                excIds+= _to;
            }
            if(_to == id){
                excIds+= _from;
            }
            if(i!=params.edges.length-1){
                excIds+=',';
            }
        }
        $.ajax({
            url: '/electric/relById',
            type: 'POST',
            data:{'id':id,'excIds':excIds},
            success: function(data){
                var eData = JSON.parse(data.eData);
                var vData = JSON.parse(data.vData);
                for(v in vData){
                    if(!ns._data[vData[v].id]){
                        ns.add(vData[v]);
                    }
                };
                for(e in eData){
                    if(!es._data[eData[e].id]){
                        es.add(eData[e]);
                    }
                }
            },
            dataType: 'json'
        });
    }
}