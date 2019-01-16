var polylinePointSum=[]
var polylinePoint=[]
var polylinePoint1=[]
var drawPoint=[]
var pipeIdArray=[];
var pipeNameArray=[];
var pipeColorArray=[];
var pipeWidthArray=[];
var pipeTypeArray=[];
var pipeDataArray=[];

var trackpolylinePointSum=[]
var trackpolylinePoint=[]
var trackpolylinePoint1=[]
var trackdrawPoint=[]
var trackpipeIdArray=[];
var trackpipeNameArray=[];
var trackpipeColorArray=[];
var trackpipeWidthArray=[];
var trackpipeTypeArray=[];
var trackpipeDataArray=[];
var idSign

//
//var polylinePointSum1=[{lng: 116.277, lat: 39.924427},{lng: 116.650217, lat: 39.818672},{lng: 116.670601, lat: 39.987884}]
//var polylinePointSum2=[{lng: 116.399, lat: 39.991236},{lng: 116.550217, lat: 39.918672},{lng: 116.660601, lat: 39.947884}]

// polylinePointSum.push(polylinePointSum1)
// polylinePointSum.push(polylinePointSum2)
// console.log(polylinePointSum)
// init()
// function init()
// {
//map.disableDoubleClickZoom()
   $.ajax({
        url: 'api/tenantpipes/'+tenantId,
        type: 'get',
        async : false,
        dataType: 'json',
        contentType: 'application/json;',

        error:function(){
            toastr.error('失败');
        },
        success: function(req) {
            console.log(req)
            for (var i = 0; i < req.pipes.length; i++) {
                polylinePoint1=[]
                pipeIdArray.push(req.pipes[i].id);
                pipeNameArray.push(req.pipes[i].name);
                pipeColorArray.push(req.pipes[i].pipeColor);
                pipeWidthArray.push(req.pipes[i].pipeWidth);
                pipeTypeArray.push(req.pipes[i].pipeType);
                pipeDataArray.push(new Date(req.pipes[i].createdAt));
                //console.log($.parseJSON(req.pipes[i].drawPoint).point)
                polylinePointSum.push($.parseJSON(req.pipes[i].drawPoint).point);
        }
        console.log(polylinePointSum)
        pipeShow(1,polylinePointSum,pipeIdArray,pipeNameArray,pipeColorArray,pipeWidthArray,pipeTypeArray,pipeDataArray);

        }
       }); 

   $.ajax({
        url: 'api/tenantpatroltracks/'+tenantId,
        type: 'get',
        async : false,
        dataType: 'json',
        contentType: 'application/json;',

        error:function(){
            toastr.error('失败');
        },
        success: function(req) {
            console.log(req)
            for (var i = 0; i < req.patroltracks.length; i++) {
                trackpolylinePoint1=[]
                trackpipeIdArray.push(req.patroltracks[i].id);
                trackpipeNameArray.push(req.patroltracks[i].name);
                trackpipeColorArray.push(req.patroltracks[i].pipeColor);
                trackpipeWidthArray.push(req.patroltracks[i].pipeWidth);
                trackpipeTypeArray.push(req.patroltracks[i].pipeType);
                trackpipeDataArray.push(new Date(req.patroltracks[i].createdAt));
                //console.log($.parseJSON(req.pipes[i].drawPoint).point)
                trackpolylinePointSum.push($.parseJSON(req.patroltracks[i].drawPoint).point);
        }
        console.log(trackpolylinePointSum)
        pipeShow(2,trackpolylinePointSum,trackpipeIdArray,trackpipeNameArray,trackpipeColorArray,trackpipeWidthArray,trackpipeTypeArray,trackpipeDataArray);

        }
       }); 
// }



function pipeShow(type,polylinePointSum,pipeIdArray,pipeNameArray,pipeColorArray,pipeWidthArray,pipeTypeArray,pipeDataArray)
{
    switch(type)
    {
    case 1:
        for(i=0;i<polylinePointSum.length;i++)
        {   
            drawPoint=[]
            for(j=0;j<polylinePointSum[i].length;j++)
            {
                polylinePoint=new BMap.Point(polylinePointSum[i][j].lng,polylinePointSum[i][j].lat)
                //console.log(polylinePoint)
                drawPoint.push(polylinePoint)
                //console.log(drawPoint)
            }
            
            function openInfo(content,e){
                var p = e.target;
                 console.log(e.target)
                var point = new BMap.Point(p.getPosition().lng, p.getPosition().lat);
                var infoWindow = new BMap.InfoWindow(content,opts);  // 创建信息窗口对象
                map.openInfoWindow(infoWindow,point); //开启信息窗口
            }

            function addClickHandler(content,marker){
                marker.addEventListener("click",function(e){
                    openInfo(content,e)
                    openIfoID=marker;
                    });
                marker.addEventListener("dbclick",function(){
                    alert('1')
                    });
            }
            
            var opts = {
                width : 100,     // 信息窗口宽度
                height: 50,     // 信息窗口高度
                enableAutoPan:true,
                enableMessage:true//设置允许信息窗发送短息
            };
            var content =
                        '<div >'+
                        ' <table>'+
                        ' <tr>'+
                        ' <td>'+'用户id:'+'</td>'+
                        '<td>'+tenantId+
                        '</td>'+
                        '</tr>'+
                        ' <tr>'+
                        ' <td>'+'管廊名称:'+'</td>'+
                        '<td>'+pipeNameArray[i]+
                        '</td>'+
                        '</tr>'+
                        '<tr>'+
                        '<td>'+'创建时间:'+'</td>'+
                        '<td>'+pipeDataArray[i].getFullYear()+'-'+(pipeDataArray[i].getMonth()+1)+'-'+pipeDataArray[i].getDate()+'</td>'+
                        '</tr>'+
                        '</table> '
            //起点
            var myIcon = new BMap.Icon("../static/baidu/img/us_mk_icon.png", new BMap.Size(23, 20), {  
                                    anchor: new BMap.Size(5, 20), // 指定定位位置  
                                    imageOffset: new BMap.Size(0, -45) // 设置图片偏移  
                                }); 
            var marker = new BMap.Marker(drawPoint[0],{icon:myIcon}); // 创建点
            map.addOverlay(marker);
            var label = new BMap.Label(pipeNameArray[i],{offset:new BMap.Size(20,-10)});
            marker.setLabel(label);
            addClickHandler(content,marker);
            //终点
            var myIcon = new BMap.Icon("../static/baidu/img/us_mk_icon.png", new BMap.Size(21, 21), {  
                                    anchor: new BMap.Size(5, 20), // 指定定位位置  
                                    imageOffset: new BMap.Size(-46, -45) // 设置图片偏移  
                                });
            var marker = new BMap.Marker(drawPoint[drawPoint.length-1],{icon:myIcon}); // 创建点
            map.addOverlay(marker);

            var styleOptions = {
                        strokeColor:pipeColorArray[i],    //边线颜色。
                        fillColor:"",      //填充颜色。当参数为空时，圆形将没有填充效果。
                        strokeWeight: pipeWidthArray[i],       //边线的宽度，以像素为单位。
                        strokeOpacity: 0.8,    //边线透明度，取值范围0 - 1。
                        fillOpacity: 0.6,      //填充的透明度，取值范围0 - 1。
                        strokeStyle: pipeTypeArray[i] //边线的样式，solid或dashed。
                    }

            //////////////////////////////删除站点//////////////////////////////
            function removePolyline(e,ee,polyline){
                var mymessage=confirm("确认删除站点？");
                if(mymessage==true)
                {        
                    for(i=0;i<polylinePointSum.length;i++)
                    {
                        if(JSON.stringify(polylinePointSum[i]) == JSON.stringify(polyline.getPath()))
                        {
                            idSign=pipeIdArray[i]
                        }                
                    }
                    $.ajax({
                    url: '/api/pipes/'+idSign,
                    type: 'delete',
                    dataType: 'json',
                    //contentType: 'application/json;',
                    error:function(){
                        toastr.error('删除失败');
                    },
                    success: function(req) {
                        //toastr.warning('修改完成')
                        window.location.reload();
                    }
                });   
                }
                else if(mymessage==false)
                {
                   
                }
                
            }
            function alterPolyline(e,ee,polyline){
                polyline.enableEditing()
                for(i=0;i<polylinePointSum.length;i++)
                {
                    if(JSON.stringify(polylinePointSum[i]) == JSON.stringify(polyline.getPath()))
                    {
                        idSign=pipeIdArray[i]
                    }                
                }
                //console.log(idSign)
            }
            function savePolyline(e,ee,polyline){
                polyline.disableEditing()
                var draw={point:polyline.getPath()}
                console.log(JSON.stringify(draw))
                $.ajax({
                    url: '/api/resetdrawPoint/'+idSign,
                    type: 'put',
                    data:
                        {drawPoint:JSON.stringify(draw)},
                    dataType: 'json',
                    //contentType: 'application/json;',

                    error:function(){
                        toastr.error('修改失败');
                    },
                    success: function(req) {
                        //toastr.warning('修改完成')
                        window.location.reload();
                    }
                }); 
                
            }

            var polyline = new BMap.Polyline(drawPoint,styleOptions);
            map.addOverlay(polyline);   //增加折线
            //addPolylineClickHandler(polyline)
            var polylineMenu=new BMap.ContextMenu();
            polylineMenu.addItem(new BMap.MenuItem('删除',removePolyline.bind(polyline)));
            polylineMenu.addItem(new BMap.MenuItem('修改',alterPolyline.bind(polyline)));
            polylineMenu.addItem(new BMap.MenuItem('保存',savePolyline.bind(polyline)));
            polyline.addContextMenu(polylineMenu);
             
        } 
    break;
    case 2:
        for(i=0;i<polylinePointSum.length;i++)
        {   
            drawPoint=[]
            for(j=0;j<polylinePointSum[i].length;j++)
            {
                polylinePoint=new BMap.Point(polylinePointSum[i][j].lng,polylinePointSum[i][j].lat)
                //console.log(polylinePoint)
                drawPoint.push(polylinePoint)
                //console.log(drawPoint)
            }
            
            function openInfo(content,e){
                var p = e.target;
                 console.log(e.target)
                var point = new BMap.Point(p.getPosition().lng, p.getPosition().lat);
                var infoWindow = new BMap.InfoWindow(content,opts);  // 创建信息窗口对象
                map.openInfoWindow(infoWindow,point); //开启信息窗口
            }

            function addClickHandler(content,marker){
                marker.addEventListener("click",function(e){
                    openInfo(content,e)
                    openIfoID=marker;
                    });
            }
            
            var opts = {
                width : 100,     // 信息窗口宽度
                height: 50,     // 信息窗口高度
                enableAutoPan:true,
                enableMessage:true//设置允许信息窗发送短息
            };
            var content =
                        '<div >'+
                        ' <table>'+
                        ' <tr>'+
                        ' <td>'+'用户id:'+'</td>'+
                        '<td>'+tenantId+
                        '</td>'+
                        '</tr>'+
                        ' <tr>'+
                        ' <td>'+'巡检线路名称:'+'</td>'+
                        '<td>'+pipeNameArray[i]+
                        '</td>'+
                        '</tr>'+
                        '<tr>'+
                        '<td>'+'创建时间:'+'</td>'+
                        '<td>'+pipeDataArray[i].getFullYear()+'-'+(pipeDataArray[i].getMonth()+1)+'-'+pipeDataArray[i].getDate()+'</td>'+
                        '</tr>'+
                        '</table> '
            var myIcon = new BMap.Icon("../static/baidu/img/us_mk_icon.png", new BMap.Size(23, 20), {  
                                    anchor: new BMap.Size(5, 20), // 指定定位位置  
                                    imageOffset: new BMap.Size(0, 0) // 设置图片偏移  
                                }); 
            var marker = new BMap.Marker(drawPoint[0],{icon:myIcon}); // 创建点
            map.addOverlay(marker);
            var label = new BMap.Label(pipeNameArray[i],{offset:new BMap.Size(20,-10)});
            marker.setLabel(label);
            addClickHandler(content,marker);

            var myIcon = new BMap.Icon("../static/baidu/img/us_mk_icon.png", new BMap.Size(21, 21), {  
                                    anchor: new BMap.Size(5, 20), // 指定定位位置  
                                    imageOffset: new BMap.Size(-46, 0) // 设置图片偏移  
                                });
            var marker = new BMap.Marker(drawPoint[drawPoint.length-1],{icon:myIcon}); // 创建点
            map.addOverlay(marker);

            //////////////////////////////删除站点//////////////////////////////
            function removeTrackPolyline(e,ee,polyline){
                var mymessage=confirm("确认删除站点？");
                if(mymessage==true)
                {        
                    for(i=0;i<polylinePointSum.length;i++)
                    {
                        if(JSON.stringify(polylinePointSum[i]) == JSON.stringify(polyline.getPath()))
                        {
                            idSign=pipeIdArray[i]
                        }                
                    }
                    $.ajax({
                    url: '/api/patroltracks/'+idSign,
                    type: 'delete',
                    dataType: 'json',
                    //contentType: 'application/json;',
                    error:function(){
                        toastr.error('删除失败');
                    },
                    success: function(req) {
                        //toastr.warning('修改完成')
                        window.location.reload();
                    }
                });   
                }
                else if(mymessage==false)
                {
                   
                }
                
            }
            function alterTrackPolyline(e,ee,polyline){
                polyline.enableEditing()
                for(i=0;i<polylinePointSum.length;i++)
                {
                    if(JSON.stringify(polylinePointSum[i]) == JSON.stringify(polyline.getPath()))
                    {
                        idSign=pipeIdArray[i]
                    }                
                }
                //console.log(idSign)
            }
            function saveTrackPolyline(e,ee,polyline){
                polyline.disableEditing()
                var draw={point:polyline.getPath()}
                console.log(JSON.stringify(draw))
                $.ajax({
                    url: '/api/resetPatroltrackdrawPoint/'+idSign,
                    type: 'put',
                    data:
                        {drawPoint:JSON.stringify(draw)},
                    dataType: 'json',
                    //contentType: 'application/json;',

                    error:function(){
                        toastr.error('修改失败');
                    },
                    success: function(req) {
                        //toastr.warning('修改完成')
                        window.location.reload();
                    }
                }); 
                
            }

            // var sy = new BMap.Symbol(BMap_Symbol_SHAPE_BACKWARD_OPEN_ARROW, {
            //         scale: 0.6,//图标缩放大小
            //         strokeColor:'#fff',//设置矢量图标的线填充颜色
            //         strokeWeight: '2',//设置线宽
            // });
            // var icons = new BMap.IconSequence(sy, '10', '30');
            var styleOptions = {
                        strokeColor:pipeColorArray[i],    //边线颜色。
                        fillColor:"",      //填充颜色。当参数为空时，圆形将没有填充效果。
                        strokeWeight: pipeWidthArray[i],       //边线的宽度，以像素为单位。
                        strokeOpacity: 0.8,    //边线透明度，取值范围0 - 1。
                        fillOpacity: 0.6,      //填充的透明度，取值范围0 - 1。
                        //icons:[icons],
                        strokeStyle: pipeTypeArray[i] //边线的样式，solid或dashed。
            }

            var polyline = new BMap.Polyline(drawPoint,styleOptions);
            map.addOverlay(polyline);   //增加折线
            //addPolylineClickHandler(polyline)
            var polylineMenu=new BMap.ContextMenu();
            polylineMenu.addItem(new BMap.MenuItem('删除',removeTrackPolyline.bind(polyline)));
            polylineMenu.addItem(new BMap.MenuItem('修改',alterTrackPolyline.bind(polyline)));
            polylineMenu.addItem(new BMap.MenuItem('保存',saveTrackPolyline.bind(polyline)));
            polyline.addContextMenu(polylineMenu);
             
        }
    break;

    }

    
}






