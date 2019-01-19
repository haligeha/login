<template>
    <div id="page-wrapper">
      <div class="header">
        <h1 class="page-header">
          巡检地图
        </h1>
        <ol class="breadcrumb">
          <el-dropdown>
          <el-button type="primary">
            面积测量
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item ><el-button type="primary" @click="rectangleAreaMeasure">矩形测量
            </el-button></el-dropdown-item>
            <el-dropdown-item ><el-button type="primary" @click="circleAreaMeasure">圆形测量
            </el-button></el-dropdown-item>
            <el-dropdown-item ><el-button type="primary" @click="areaMeasure">多边形测量
            </el-button></el-dropdown-item>
            <el-dropdown-item ><el-button type="primary" @click="clearAll">清除结果
            </el-button></el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-button type="primary" @click="measure">距离测距</el-button>
        <el-button type="primary" @click="addSite">添加标注</el-button>
        <el-button type="primary" @click="frameSelection">框选搜索</el-button>
        <!--<el-button type="primary" onclick="showFrame()">设备搜索</el-button>-->
        <el-button type="primary" @click="showWarning">查看报警事件</el-button>
        <el-button type="primary" @click="dialogDraw=true">绘制功能</el-button>
        </ol>

      </div>

      <div class="pageBody" style="width:100%;height:100%;" :data="reqArray">
        <div id="allmap"></div>



    <!-- 各种弹框 -->
    <!-- 添加标记 -->
    <el-dialog title="添加标记":visible.sync="dialogAddVisible">
      <el-form>
       <!--  <el-form-item label="用户ID">
          <el-input v-model="form.tanentId" prop="tanentId"  autocomplete="off"></el-input>
        </el-form-item> -->
        <el-form-item label="站点名称">
          <el-input v-model="form.siteName" prop="siteName"  autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="经度">
          <el-input v-model="form.longitude" prop="longitude"  autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="纬度">
          <el-input v-model="form.latitude" prop="latitude"  autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm(),dialogAddVisible=false">取消</el-button>
        <el-button type="primary" @click="addSiteConfirm">确定</el-button>
      </div>
    </el-dialog>

    <!-- 修改站点名 -->
    <el-dialog title="修改站点":visible.sync="dialogrenameSite">
        <el-form>
        <el-form-item label="站点原名">
          <el-input v-model="form.siteOldName" prop="siteOldName"  autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="修改名称">
          <el-input v-model="form.siteNewName" prop="siteNewName"  autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm(),dialogAddVisible=false">取消</el-button>
        <el-button type="primary" @click="renameSite">确定</el-button>
      </div>

    </el-dialog>

     <!-- 报警 -->
     <el-dialog title="报警信息":visible.sync="dialogWarning" @close='handleClose' width="70%">
      <el-table :data="warningTableData.slice((currentPage-1)*pageSize,currentPage*pageSize)"  >
        <el-table-column property="id" label="事件ID" width="70"></el-table-column>
        <el-table-column property="deviceid" label="设备ID" width="200"></el-table-column>
        <el-table-column property="content" label="描述" width="200"></el-table-column>
        <el-table-column property="time" label="时间"></el-table-column>
        <el-table-column property="status" label="状态"></el-table-column>
        <el-table-column property="address" label="操作">
            <template slot-scope="scope">
                <el-button size="mini" @click="warningCheck(scope.row)">站点设备</el-button>
            </template>
        </el-table-column>
      </el-table>
      <div class="block">
              <el-pagination align='center' @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage":total="warningTableData.length" :page-sizes="[5, 10, 100]"  layout="total, sizes, prev, pager, next, jumper" >
            </el-pagination>
</div>

    <el-dialog title="设备详情":visible.sync="dialogDeviceDetail" append-to-body @close='handleClose'>
        <el-input v-model="form.dialogDeviceDetail" :disabled="true" size="mini"></el-input>
        <h4 >-----最新遥测-----</h4>
          <el-table :data="DeviceDetailTableData">
            <el-table-column property="updateTime" label="最后更新时间" ></el-table-column>
            <el-table-column property="updateKey" label="键" ></el-table-column>
            <el-table-column property="updateValue" label="值"></el-table-column>
          </el-table>
        <h4 >-----控制面板-----</h4>
        <el-row >
            <el-col :span="8" v-for="(x,indexs) in control">
                <el-form >
                    <span>{{x.serviceName}}({{indexs}})</span>
                    <el-form  v-for="(w,index) in x.serviceBody.params">
                          <el-form-item >
                            <el-col :span="8">{{w.key}}({{index}})</el-col>
                            <el-col :span="8">
                                <el-switch v-if="w.type==3" v-model="w.value" ></el-switch>
                                <el-slider v-if="w.type==2" v-model="w.value" ></el-slider>
                                <el-input v-if="w.type==1" v-model="w.value" ></el-input>
                            </el-col>
                          </el-form-item>                                          
                    </el-form>
                    <el-button size="mini" @click="controlConfirm(x,x.serviceBody.params)">确定</el-button>
                </el-form>
            </el-col>
        </el-row>
    </el-dialog>

    </el-dialog>


    <!-- 站点设备 -->
    <el-dialog title="站点设备":visible.sync="dialogSiteDevice" @close='handleClose'>
      <el-table :data="SiteDeviceTableData">
        <el-table-column property="id" label="设备ID" ></el-table-column>
        <el-table-column property="deviceName" label="设备名称" ></el-table-column>
        <el-table-column property="deviceType" label="设备类型"></el-table-column>
        <el-table-column property="deviceTime" label="创建时间"></el-table-column>
        <el-table-column property="address" label="操作">
            <template slot-scope="scope">
                <el-button size="mini" @click="check(scope.row)">设备属性</el-button>
            </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="prePage">上一页</el-button>
        <el-button type="primary" @click="nextPage">下一页</el-button>
      </div>
    </el-dialog>


    <!-- 绘制管廊 -->
    <el-dialog title="绘制功能":visible.sync="dialogDraw">
        <el-radio v-model="radio" label="1">绘制管廊</el-radio>
        <el-radio v-model="radio" label="2">绘制巡检线路</el-radio>
        <el-form v-show="radio == 1">
        <el-form-item label="管廊名称"><span>*</span>
          <el-input v-model="form.name" prop="name"  autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="管廊大小">
          <el-input v-model="form.pipeWidth" type="number" prop="pipeWidth"  autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="管廊类型">
            <el-select v-model="form.pipeType" prop="activity_range" placeholder="请选择管廊类型">
            <el-option label="实线" value="1"></el-option>
            <el-option label="虚线" value="2"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="管廊颜色">
          <el-color-picker v-model="form.pipeColor"></el-color-picker>
        </el-form-item>
      </el-form>

      <el-form v-show="radio == 2">
        <el-form-item label="巡检线路名称"><span>*</span>
          <el-input v-model="form.name" prop="name"  autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="巡检线路大小">
          <el-input v-model="form.pipeWidth" type="number" prop="pipeWidth"  autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="巡检线路类型">
          <el-select v-model="form.pipeType" prop="activity_range" placeholder="请选择管廊类型">
            <el-option label="实线" value="1"></el-option>
            <el-option label="虚线" value="2"></el-option>
            </el-select>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="巡检线路颜色">
          <el-color-picker v-model="form.pipeColor"></el-color-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm(),dialogDraw=false">取消</el-button>
        <el-button type="primary" @click="drawPipe">确定</el-button>
      </div>
    </el-dialog>

    <!-- ///////框选////// -->
    <el-dialog title="框选搜索":visible.sync="dialogframeSelection" @close='handleClose'>
        <el-table :data="siteTableData" style="width: 98%;left:20px">
        <el-table-column label="站点ID" prop="id" ></el-table-column>
        <el-table-column label="站点名" prop="siteName"></el-table-column>
        <el-table-column label="创建时间" prop="createdat"></el-table-column>
        <el-table-column>
            <template slot-scope="scope">
                <el-button size="mini" @click="check(true,scope.row)">站点设备</el-button>
            </template>
        </el-table-column>
      </el-table>
    </el-dialog>

</div>
    </div>
</template>

<script>

import BMap from 'BMap'
window.tenantId=localStorage.getItem("tenant_id")
window.reqArray=[];
var idArray=[];
var logArray=[];
var lohArray=[];
var nameArray=[];
var adds=[];
window.adds=adds
var openIfoID;
var markers=[];
var overlays=[];
window.overlays=overlays;
var label=[];
var markerClusterer
var drawPoint=[]
var drawPoint1=[]
var polylinePoint=[]

var polylinePointSum=[]
var pipeIdArray=[];
var pipeNameArray=[];
var pipeColorArray=[];
var pipeWidthArray=[];
var pipeTypeArray=[];
var pipeDataArray=[];

var trackpolylinePointSum=[]
var trackdrawPoint=[]
var trackpipeIdArray=[];
var trackpipeNameArray=[];
var trackpipeColorArray=[];
var trackpipeWidthArray=[];
var trackpipeTypeArray=[];
var trackpipeDataArray=[];
var idSign

var sitesID
var idOffset;//用于查找下一页
var textOffset;//用于查找下一页
var hasNext;//判断是否存在下一页
var preDeviceId = [];//用于查找上一页
var preDeviceName = [];//用于查找上一页
var pageNum = 1;//记录当前页面
export default {

data() {
        return {
            radio: '1',
            control:'',
            control1:'',
            value1:[[]],
            value2:[[]],
            value3:[[]],
            pipeColor: null,
            renameMarker:'',
            renameSiteId:'',
            siteReqArray:[],
            siteTableData:[],
            warningTableData:[],
            DeviceDetailTableData:[],
            SiteDeviceTableData:[],
            dialogDraw: false,
            dialogAddVisible:false,
            dialogWarning:false,
            dialogframeSelection:false,
            dialogrenameSite:false,
            dialogSiteDevice:false,
            dialogDeviceDetail:false,
            form:{},
            websocket: null,
            currentPage: 1, // 当前页码
            pageSize: 5 ,// 每页的数据条数
        };
      },
created(){
   //页面刚进入时开启长连接
    this.initWebSocket()
},
destroyed: function() {
　　//页面销毁时关闭长连接
    this.websocketclose();
},
mounted()
{
    this.ready()
},
  methods: {
     ready: function(){
        console.log(localStorage.getItem("auth"))
        var vm=this
        window.vm=vm
        console.log(vm)
        var map = new BMap.Map("allmap",{enableMapClick:false});    // 创建Map实例]
        window.map = map
        //var markerClusterer
        window.markerClusterer
        map.centerAndZoom(new BMap.Point(116.404, 39.915), 12);  // 初始化地图,设置中心点坐标和地图级别
        //添加地图类型控件
        map.addControl(new BMap.MapTypeControl({
            anchor: BMAP_ANCHOR_BOTTOM_RIGHT,
            mapTypes:[
                BMAP_NORMAL_MAP,
                BMAP_HYBRID_MAP,
                BMAP_SATELLITE_MAP,
            ]}));
        window.overlaycomplete=function(e){
            overlays.push(e.overlay);
            label.push(e.label);
            //console.log(e);
        };
        //添加比例尺等控件
        var top_left_control = new BMap.ScaleControl({anchor: BMAP_ANCHOR_TOP_LEFT});// 左上角，添加比例尺
        var top_left_navigation = new BMap.NavigationControl();  //左上角，添加默认缩放平移控件
        //var top_right_navigation = new BMap.NavigationControl({anchor: BMAP_ANCHOR_TOP_RIGHT, type: BMAP_NAVIGATION_CONTROL_SMALL}); //右上角，仅包含平移和缩放按钮
        map.addControl(top_left_control);
        map.addControl(top_left_navigation);

        map.centerAndZoom("北京");         // 设置地图显示的城市 此项是必须设置的
        map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
        var point=new BMap.Point(116.404, 39.915);
        map.centerAndZoom(point, 12);
            var styleOptions = {
                strokeColor:"red",    //边线颜色。
                fillColor:"red",      //填充颜色。当参数为空时，圆形将没有填充效果。
                strokeWeight: 3,       //边线的宽度，以像素为单位。
                strokeOpacity: 0.8,    //边线透明度，取值范围0 - 1。
                fillOpacity: 0.6,      //填充的透明度，取值范围0 - 1。
                strokeStyle: 'solid' //边线的样式，solid或dashed。
            }
            //实例化鼠标绘制工具
            var drawingManager = new BMapLib.DrawingManager(map, {
                isOpen: false, //是否开启绘制模式
                enableDrawingTool: false, //是否显示工具栏
                drawingToolOptions: {
                    anchor: BMAP_ANCHOR_TOP_RIGHT, //位置
                    offset: new BMap.Size(5, 5), //偏离值
                },
                circleOptions: styleOptions, //圆的样式
                polylineOptions: styleOptions, //线的样式
                polygonOptions: styleOptions, //多边形的样式
                rectangleOptions: styleOptions //矩形的样式
            });
            window.drawingManager=drawingManager

        window.getSites=function()
        {
            $.ajax({
                url: 'http://10.112.17.185:8101/api/v1/map/sitesAll',
                type: 'get',
                async : false,
                dataType: 'json',
                contentType: 'application/json;charset=UTF-8',
                error:function(){
                    toastr.warning('失败');
                },
                success: function(req) {
                    //请求成功时处理
                    console.log(req)
                    idArray=[];
                    logArray=[];
                    lohArray=[];
                    nameArray=[];
                    reqArray=req;
                    for (var i = 0; i < req.length; i++) {
                        idArray.push(req[i].id);
                        logArray.push(req[i].longtitude);
                        lohArray.push(req[i].latitude);
                        nameArray.push(req[i].name);
                        //console.log(req.sites[i].id);
                }
                }
            });
        }

        /////////显示标记点////////
        window.addClickHandler=function (content,marker){

            marker.addEventListener("click",function(e){
                openInfo(content,e)
                openIfoID=marker;
                //console.log(openIfoID);
                //console.log(content);
                }
            );
            var markerMenu=new BMap.ContextMenu();
            markerMenu.addItem(new BMap.MenuItem('删除',removeMarker.bind(marker)));
            marker.addContextMenu(markerMenu);
        }

        window.openInfo=function (content,e){
            var p = e.target;
            var point = new BMap.Point(p.getPosition().lng, p.getPosition().lat);
            var infoWindow = new BMap.InfoWindow(content,opts);  // 创建信息窗口对象
            map.openInfoWindow(infoWindow,point); //开启信息窗口
        }

        //////////////////////////////删除站点//////////////////////////////
        function removeMarker(e,ee,marker){
            var mymessage=confirm("确认删除站点？");
            if(mymessage==true)
            {
                console.log(marker.point);
                console.log(reqArray)
                for(var i=0;i<reqArray.length;i++)
                {
                    if((marker.point.lat==reqArray[i].latitude)&& (marker.point.lng==reqArray[i].longtitude))
                    {
                        console.log(reqArray[i].id)
                        map.removeOverlay(marker);
                        markerClusterer.removeMarker(marker); //删除标记从聚合点中删除
                        $.ajax({
                            url:'http://10.112.17.185:8101/api/v1/map/sites/?sitesId='+reqArray[i].id,
                            type:'DELETE',//提交方式
                            dataType:'JSON',//返回字符串，T大写
                            success: function(req)
                            {

                                toastr.warning('删除成功');

                            },
                            error:function(error)
                            {
                                console.log(error)
                            },
                            complete:function()
                            {
                                getSites();
                            }
                        });
                    }
                }

            }
            else if(mymessage==false)
            {

            }
        }

                /////////////修改////////////////
        window.alterSite=function ()
        {
            vm.dialogrenameSite=true
            for (var i = 0; i < reqArray.length; i++) {
                if ((openIfoID.point.lat == reqArray[i].latitude) && (openIfoID.point.lng == reqArray[i].longtitude)) {
                    vm.renameMarker=openIfoID;
                    vm.renameSiteId=reqArray[i].id
                    vm.form.siteOldName=reqArray[i].name
                    console.log(vm.renameSiteId)
                    }
            }
        }


        var opts = {
            width : 350,     // 信息窗口宽度
            height: 150,     // 信息窗口高度
            enableAutoPan:true,
            enableMessage:true//设置允许信息窗发送短息

        };

        window.addContent=function (tenantId,id,name,longtitude,latitude,year,month,date)
        {
                var content =
                            '<div >'+
                            ' <table>'+
                            ' <tr>'+
                            ' <td>'+'用户id:'+'</td>'+
                            '<td>'+tenantId+
                            '</td>'+
                            '</tr>'+
                            ' <tr>'+
                            ' <td>'+'站点id:'+'</td>'+
                            '<td>'+id+
                            '</td>'+
                            '</tr>'+
                            '<tr>'+
                            '<td>'+'名称:'+'</td>'+
                            '<td>'+name+'</td>'+
                            '</tr>'+
                            '<tr>'+
                            '<td>'+'经度:'+'</td>'+
                            '<td>'+longtitude+'</td>'+
                            '</tr>'+
                            '<tr>'+
                            '<td>'+'纬度:'+'</td>'+
                            '<td>'+latitude+'</td>'+
                            '</tr>'+
                            '<tr>'+
                            '<td>'+'创建时间:'+'</td>'+
                            '<td>'+year+'-'+month+'-'+date+'</td>'+
                            '</tr>'+
                            '</table> '
                            //+'<input type="button" id="addModel" value="上传场景" onclick="addModel()" />'+'&nbsp;&nbsp;&nbsp;&nbsp;'
                            +'<input type="button" id="alterSite" value="修改站点" onclick="alterSite()"/>'+'&nbsp;&nbsp;&nbsp;&nbsp;'
                            +'<input type="button" value="站点设备" onclick="showDevice()">'+'&nbsp;&nbsp;&nbsp;&nbsp;'
                            //+'<input type="button" value="进入场景" onclick="intoScence()">'
                            +'</div>'

                            return content;
        }

        window.addMarkers=function (id,longtitude,latitude,sign)
        {
                        var point=new BMap.Point(longtitude,latitude);
                        adds.push(point);
                        var marker = new BMap.Marker(point);// 创建标注
                        markers.push(marker);
                        if(sign)
                        {
                            map.addOverlay(marker);
                            markerClusterer.addMarker(marker); //新建标记放入聚合点
                        }
                        marker.disableDragging();           // 不可拖拽
                        var label = new BMap.Label(id,{offset:new BMap.Size(20,-10)});
                        marker.setLabel(label);
                        return marker;
        }

        //////////////////站点设备
        window.showDevice=function (argument) {
            for (var i = 0; i < reqArray.length; i++) {
                if ((openIfoID.point.lat == reqArray[i].latitude) && (openIfoID.point.lng == reqArray[i].longtitude)) {
                    console.log(reqArray[i].id)
                    vm.check(false,reqArray[i].id)
                    }
            }
        }

        $.ajax({
        url: 'http://10.112.17.185:8101/api/v1/map/sitesAll',
        type: 'get',
        async : false,
        dataType: 'json',
        error:function(error){
            console.log(error)
            toastr.warning('失败');
        },
        success: function(req) {
            console.log(req);
            //请求成功时处理
            reqArray=req;
            idArray=[];
            logArray=[];
            lohArray=[];
            nameArray=[];
            for (var i = 0; i < req.length; i++) {
                idArray.push(req[i].id);
                logArray.push(req[i].longtitude);
                lohArray.push(req[i].latitude);
                nameArray.push(req[i].name);
                 var date1=new Date(req[i].createdat);
                 var year=date1.getFullYear();
                 var month=date1.getMonth()+1;
                 var date=date1.getDate();
                 var content =addContent(tenantId,req[i].id,req[i].name,req[i].longtitude,req[i].latitude,year,month,date)
                 var marker =addMarkers(req[i].id,req[i].longtitude,req[i].latitude)
                 addClickHandler(content,marker);

            }
             markerClusterer = new BMapLib.MarkerClusterer(map, {markers:markers});
        }
    });

//////////////管廊显示///////////

    $.ajax({
        url: 'http://10.112.17.185:8101/api/v1/map/pipeAll',
        type: 'get',
        async : false,
        dataType: 'json',
        contentType: 'application/json;',

        error:function(){
            toastr.error('失败');
        },
        success: function(req) {
            console.log(req)
            for (var i = 0; i < req.length; i++) {
                pipeIdArray.push(req[i].id);
                pipeNameArray.push(req[i].name);
                pipeColorArray.push(req[i].pipecolor);
                pipeWidthArray.push(req[i].pipewidth);
                pipeTypeArray.push(req[i].pipetype);
                pipeDataArray.push(new Date(req[i].createdat));
                //console.log($.parseJSON(req.pipes[i].drawpoint).point)
                console.log(req[i].drawpoint.point)
                polylinePointSum.push(req[i].drawpoint.point);
        }
        //console.log(polylinePointSum)
        pipeShow(1,polylinePointSum,pipeIdArray,pipeNameArray,pipeColorArray,pipeWidthArray,pipeTypeArray,pipeDataArray);

        }
       });

   $.ajax({
        url: 'http://10.112.17.185:8101/api/v1/map/patroltrackAll',
        type: 'get',
        async : false,
        dataType: 'json',
        contentType: 'application/json;',

        error:function(){
            toastr.error('失败');
        },
        success: function(req) {
            //console.log(req)
            for (var i = 0; i < req.length; i++) {
                trackpipeIdArray.push(req[i].id);
                trackpipeNameArray.push(req[i].name);
                trackpipeColorArray.push(req[i].pipecolor);
                trackpipeWidthArray.push(req[i].pipewidth);
                trackpipeTypeArray.push(req[i].pipetype);
                trackpipeDataArray.push(new Date(req[i].createdat));
                //console.log($.parseJSON(req.pipes[i].drawPoint).point)
                trackpolylinePointSum.push(req[i].drawpoint.point);
        }
        //console.log(trackpolylinePointSum)
        pipeShow(2,trackpolylinePointSum,trackpipeIdArray,trackpipeNameArray,trackpipeColorArray,trackpipeWidthArray,trackpipeTypeArray,trackpipeDataArray);

        }
       });
// }



    function pipeShow(type,polylinePointSum,pipeIdArray,pipeNameArray,pipeColorArray,pipeWidthArray,pipeTypeArray,pipeDataArray)
    {
        switch(type)
        {
        case 1:
            for(var i=0;i<polylinePointSum.length;i++)
            {
                drawPoint=[]
                for(var j=0;j<polylinePointSum[i].length;j++)
                {
                    polylinePoint=new BMap.Point(polylinePointSum[i][j].lng,polylinePointSum[i][j].lat)
                    //console.log(polylinePoint)
                    drawPoint.push(polylinePoint)
                    //console.log(drawPoint)
                }
                console.log(drawPoint)
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
                        console.log('http://10.112.17.185:8101/api/v1/map/pipe?pipeId='+idSign)
                        $.ajax({
                        url: 'http://10.112.17.185:8101/api/v1/map/pipe?pipeId='+idSign,
                        type: 'delete',
                        //dataType: 'json',
                        //contentType: 'application/json;',
                        error:function(error){
                            console.log(error)
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
                       $.ajax({
                            url: 'http://10.112.17.185:8101/api/v1/map/pipe?pipeId='+idSign,
                            type: 'get',
                            async : false,
                            dataType: 'json',
                            contentType: 'application/json;',

                            error:function(){
                                toastr.error('失败');
                            },
                            success: function(req) {
                                console.log(req)
                                var draw={point:polyline.getPath()}
                                var draw1=JSON.stringify(draw)
                                console.log(draw1)
                                console.log(JSON.stringify({id:req.id,name:req.name,tenantid:req.tenantid,pipecolor:req.pipecolor,pipewidth:req.pipewidth,pipetype:req.pipetype,drawpoint:draw1,createdat:req.createdat}))
                                $.ajax({
                                    url:'http://10.112.17.185:8101/api/v1/map/pipe',
                                    data:JSON.stringify({id:req.id,name:req.name,tenantid:req.tenantid,pipecolor:req.pipecolor,pipewidth:req.pipewidth,pipetype:req.pipetype,drawpoint:draw1,createdat:req.createdat}),
                                    type:'put',//提交方式
                                    //dataType: 'json',
                                    contentType: "application/json",

                                    success: function(req){
                                       console.log(req)
                                       window.location.reload();
                                    },
                                    error:function(error)
                                    {
                                        console.log(error)
                                        toastr.error('错误');
                                    }
                                });
                            }
                           });

                }
                //console.log(drawPoint)
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

                //////////////////////////////删除巡检线路//////////////////////////////
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
                        url: 'http://10.112.17.185:8101/api/v1/map/patroltrack/?trackId='+idSign,
                        type: 'delete',
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
                }
                function saveTrackPolyline(e,ee,polyline){
                    polyline.disableEditing()
                     $.ajax({
                            url: 'http://10.112.17.185:8101/api/v1/map/patroltrack?trackId='+idSign,
                            type: 'get',
                            async : false,
                            dataType: 'json',
                            contentType: 'application/json;',

                            error:function(){
                                toastr.error('失败');
                            },
                            success: function(req) {
                                console.log(req)
                                var draw={point:polyline.getPath()}
                                var draw1=JSON.stringify(draw)
                                console.log(draw1)
                                console.log(JSON.stringify({id:req.id,name:req.name,tenantid:req.tenantid,pipecolor:req.pipecolor,pipewidth:req.pipewidth,pipetype:req.pipetype,drawpoint:draw1,createdat:req.createdat}))
                                $.ajax({
                                    url:'http://10.112.17.185:8101/api/v1/map/patroltrack',
                                    data:JSON.stringify({id:req.id,name:req.name,tenantid:req.tenantid,pipecolor:req.pipecolor,pipewidth:req.pipewidth,pipetype:req.pipetype,drawpoint:draw1,createdat:req.createdat}),
                                    type:'put',//提交方式
                                    //dataType: 'json',
                                    contentType: "application/json",

                                    success: function(req){
                                       console.log(req)
                                       window.location.reload();
                                    },
                                    error:function(error)
                                    {
                                        console.log(error)
                                        toastr.error('错误');
                                    }
                                });
                            }
                           });

                }
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

     },
    addSite()
    {
        var vm=this
        window.getPoint=function (e)
        {
           vm.dialogAddVisible=true
           vm.form.longitude=e.point.lng
           vm.form.latitude=e.point.lat
        }
        map.setDefaultCursor("crosshair");
        map.addEventListener("click",getPoint);

    },
    addSiteConfirm()
    {
        var vm=this
        console.log(this)
          var dataPost ={};
          dataPost.tenantid = tenantId;
          dataPost.longtitude = this.form.longitude;
          dataPost.latitude = this.form.latitude;
          dataPost.name = this.form.siteName;
          dataPost.createdat = Date.parse(new Date());
          console.log(dataPost);
          var sitesInfo = JSON.stringify(dataPost);
          console.log(sitesInfo);

          $.ajax({
            url:"http://10.112.17.185:8101/api/v1/map/sites",
            type:"POST",
            contentType: "application/json;charset=utf-8",
            dataType:"JSON",
            data:sitesInfo,
            success:function(msg){
                vm.dialogAddVisible=false
                this.form={}
                console.log(msg)
              map.removeEventListener("click");
              map.removeEventListener("click",getPoint);
              map.setDefaultCursor("url(http://api0.map.bdimg.com/images/openhand.cur) 8 8,default");
              var date1=new Date(msg.createdat);
              var year=date1.getFullYear();
              var month=date1.getMonth()+1;
              var date=date1.getDate();
              console.log(idArray[idArray.length-1]+1)
              var content =addContent(tenantId,idArray[idArray.length-1]+1,msg.name,msg.longtitude,msg.latitude,year,month,date)
              var marker =addMarkers(idArray[idArray.length-1]+1,msg.longtitude,msg.latitude,true)
              addClickHandler(content,marker);
              //toastr.warning ("添加成功 ");
            },
            error:function (err) {
                console.log(err)
              alert("添加信息发送失败")
            },
            complete:function()
            {
               getSites();
            }
          })
    },
    renameSite()
    {
            //vm.dialogrenameSite=true
            console.log(vm.renameSiteId)
            $.ajax({
                        url: 'http://10.112.17.185:8101/api/v1/map/sites?sitesId='+vm.renameSiteId,
                        type: 'get',
                        async : false,
                        dataType: 'json',
                        contentType: 'application/json;',

                        error:function(){
                            toastr.error('失败');
                        },
                        success: function(req) {
                            console.log(JSON.stringify({id:req.id,name:vm.form.siteNewName,latitude:req.latitude,longtitude:req.longtitude,createdat:req.createdat}))
                            vm.form.siteOldName=req.name
                            $.ajax({
                                url:'http://10.112.17.185:8101/api/v1/map/sites',
                                data:JSON.stringify({id:req.id,tenantid:tenantId,name:vm.form.siteNewName,latitude:req.latitude,longtitude:req.longtitude,createdat:req.createdat}),
                                type:'put',//提交方式
                                //dataType: 'json',
                                contentType: "application/json",

                                success: function(req){
                                   console.log(req)
                                   window.location.reload();
                                },
                                error:function(error)
                                {
                                    console.log(error)
                                    toastr.error('错误');
                                }
                            });
                        }
                       });
    },

    measure()
    {
        var myDis = new BMapLib.DistanceTool(map);
        myDis.open();
    },
    rectangleAreaMeasure()
    {
        console.log(overlays)
        drawingManager.open()
        drawingManager.enableCalculate()
        //添加鼠标绘制工具监听事件，用于获取绘制结果
        drawingManager.addEventListener('overlaycomplete', overlaycomplete);
        drawingManager.setDrawingMode(BMAP_DRAWING_RECTANGLE);
    },
    areaMeasure()
    {
        drawingManager.open()
        drawingManager.enableCalculate()
        //添加鼠标绘制工具监听事件，用于获取绘制结果
        drawingManager.addEventListener('overlaycomplete', overlaycomplete);
        drawingManager.setDrawingMode(BMAP_DRAWING_POLYGON);
    },

    circleAreaMeasure()
    {
        drawingManager.open()
        drawingManager.enableCalculate()
        //添加鼠标绘制工具监听事件，用于获取绘制结果
        drawingManager.addEventListener('overlaycomplete', overlaycomplete);
        drawingManager.setDrawingMode(BMAP_DRAWING_CIRCLE);
    },
    clearAll()
    {
        //biaozhi=1;
        drawingManager.close();
        for(var i = 0; i < overlays.length; i++){
            map.removeOverlay(overlays[i]);
            map.removeOverlay(label[i]);
        }
        overlays.length = 0
        label.length=0;
    },

    //绘制管廊
    drawPipe()
    {
        window.drawPara=this.form
        console.log(this.form.pipeColor)
        window.radio=this.radio;
        this.dialogDraw=false
        drawingManager.open()
        drawingManager.enableCalculate()
        //添加鼠标绘制工具监听事件，用于获取绘制结果
        drawingManager.addEventListener('overlaycomplete', overlaycomplete);
        drawingManager.setDrawingMode(BMAP_DRAWING_POLYLINE);

    },

    ////////////框选//////////
    frameSelection()
    {
        vm.siteTableData=[]
        window.dialogframeSelection=this.dialogframeSelection
        drawingManager.open()
        drawingManager.enableCalculate()
        //添加鼠标绘制工具监听事件，用于获取绘制结果
        drawingManager.addEventListener('overlaycomplete', overlaycomplete);
        drawingManager.setDrawingMode(BMAP_DRAWING_RECTANGLE1);
    },

    ////////封装站点设备显示///////
    showSiteDevice(req)
    {
        console.log(req)
        for (var i = 0; i < req.data.length; i++) {
              var siteDeviceData = {};
              siteDeviceData.id = req.data[i].id;
              siteDeviceData.deviceName = req.data[i].name;
              siteDeviceData.deviceType = req.data[i].deviceType;
              siteDeviceData.deviceTime = req.data[i].createdTime;
              vm.SiteDeviceTableData.push(siteDeviceData);
              vm.dialogSiteDevice=true
            }
    },

    //////////站点设备/////////
    check(sign,row){
        console.log(sign)
        if(sign==true)
        {var url='api/3d815/siteDevicePaging/'+tenantId+'/'+row.id+'?limit=2&idOffset=&textOffset='; sitesID=row.id}
        else
        {var url='api/3d815/siteDevicePaging/'+tenantId+'/'+row+'?limit=2&idOffset=&textOffset='; sitesID=row}
        console.log(url)
        $.ajax({
        url: url,
        type: 'get',
        dataType: 'json',
        contentType: 'application/json;',
        error:function(){
            alert('失败');
        },
        success: function(req) {
             if(req.nextPageLink!=null)
             {
                vm.showSiteDevice(req)
                idOffset = req.nextPageLink.idOffset;
                textOffset = req.nextPageLink.textOffset;
                hasNext = req.hasNext;
                console.log(idOffset);
                console.log(textOffset);
                console.log(hasNext);
                preDeviceId.push(idOffset);
                preDeviceName.push(textOffset);
             }
           }
       });
    },

    ////////////////下一页///////
    nextPage()
    {
        console.log(hasNext);
        if(hasNext)
        {
            jQuery.ajax({
                url:'api/3d815/siteDevicePaging/'+tenantId+'/'+sitesID+'?limit=9&idOffset='+idOffset+'&textOffset='+textOffset,
                contentType: "application/json; ",
                async: false,
                type:"GET",
                success:function(req) {
                    pageNum++;
                    showTable(req)
                    if( req.hasNext == true){
                        idOffset = req.nextPageLink.idOffset;
                        textOffset = req.nextPageLink.textOffset;
                        hasNext = req.hasNext;
                        preDeviceId.push(idOffset);
                        preDeviceName.push(textOffset);
                    }else{
                        hasNext = req.hasNext;
                    }
                },
                error:function(err){
                    alert("当前已是最后一页！错误");
                }
            });
        }
        else
        {
            alert("当前已是最后一页！");
        }
    },

    //上一页
    prePage()
    {
        if(pageNum == 1){
            alert("当前已是第一页！");
        }
        else if(pageNum == 2){
            jQuery.ajax({
                url:"/api/3d815/siteDevicePaging/"+tenantId+'/'+sitesID+"?limit=9&idOffset=&textOffset=",
                contentType: "application/json; charset=utf-8",
                async: false,
                type:"GET",
                success:function(req) {
                    pageNum--;
                    if(req.data.length != 0){
                        showTable(req)
                        idOffset = req.nextPageLink.idOffset;
                        textOffset = req.nextPageLink.textOffset;
                        hasNext = req.hasNext;
                        preDeviceId.push(idOffset);
                        preDeviceName.push(textOffset);
                    }
                },
                error:function(err){
                    //console.log(err)
                    alert("错误");
                }
            });
        }else{
            jQuery.ajax({
                url:"/api/3d815/siteDevicePaging/"+tenantId+'/'+sitesID+"?limit=9&idOffset="+preDeviceId[pageNum-3]+"&textOffset="+preDeviceName[pageNum-3],
                contentType: "application/json; charset=utf-8",
                async: false,
                type:"GET",
                success:function(req) {
                    pageNum--;
                    showTable(req);
                    idOffset = req.nextPageLink.idOffset;
                    textOffset = req.nextPageLink.textOffset;
                    hasNext = req.hasNext;
                    preDeviceId.push(idOffset);
                    preDeviceName.push(textOffset);

                },
                error:function(err){
                    alert("错误");
                }
            });
        }
    },

    ////////////////报警设备////////
    warningCheck(row)
    {
        var abilityType=[]
        console.log(row.deviceid)
        $.ajax({
            headers: {"Authorization": "Bearer"+localStorage.getItem("auth")},
            url: 'api/v1/deviceaccess/data/alllatestdata/'+row.deviceid,
            type: 'get',
            dataType: 'json',
            contentType: 'application/json;charset=UTF-8',
            error:function(err){
                console.log(err)
            },
            success: function(req) {
                console.log(req)
                for (var i = 0; i < req.length; i++) {
                  var deviceData = {};
                  deviceData.updateTime = req[i].ts;
                  deviceData.updateKey = req[i].key;
                  deviceData.updateValue = req[i].value;
                  vm.DeviceDetailTableData.push(deviceData);
                  vm.dialogDeviceDetail=true
                }
                
            }
        });

        $.ajax({
            headers: {"Authorization": "Bearer"+localStorage.getItem("auth")},
            url: 'api/v1/deviceaccess/device/2628b0b0-d28e-11e8-b016-ed235ee3b0ad',
            type: 'get',
            dataType: 'json',
            contentType: 'application/json;charset=UTF-8',
            error:function(err){
                console.log(err)
            },
            success: function(req) {
                vm.form.dialogDeviceDetail=req.name
                console.log(req)
                console.log('/api/v1/servicemanagement/ability/'+req.manufacture+'/'+req.deviceType+'/'+req.model)
                $.ajax({
                    headers: {"Authorization": "Bearer"+localStorage.getItem("auth")},
                    url: '/api/v1/servicemanagement/ability/'+req.manufacture+'/'+req.deviceType+'/'+req.model,
                    type: 'get',
                    dataType: 'json',
                    contentType: 'application/json;charset=UTF-8',
                    error:function(err){
                        console.log(err)
                    },
                    success: function(req) {

                        console.log(req)
                        var control=[]
                        var w1=[[]]
                        var w2=[[]]
                        var w3=[[]]
                        for (var i = 0; i < req.length; i++) {
                            var abilityDesJson = JSON.parse(req[i].abilityDes);//将所有abilityDes（string）转成JSON
                            //console.log(abilityDesJson);
                            control.push(abilityDesJson)
                            var params = abilityDesJson.serviceBody.params;
                            vm.control1=params
                            // console.log(params)
                            
                            // for (var j = 0; j < params.length; j++) {
                            //     console.log(params[j].type)
                            //     switch(params[j].type)
                            //     {
                            //     case 1:
                            //       var a1=[i,j]
                             
                            //       w1.push(a1)
                            //      console.log(a1)
                            //       console.log(w1)

                            //       break;
                            //     case 2:
                            //        var a2=[i,j]
                            //        //console.log(a2)
                                  
                            //       w2.push(a1)
                            //       break;
                            //     case 3:
                            //       var a3=[i,j]
                            //       //console.log(a3)
                                  
                            //       w3.push(a3)
                            //     break;
                            //     }  
                           
                            // }

                            
                        }
                        // vm.value1=w1
                        // vm.value2=w2
                        // vm.value3=w3
                        // console.log(w1)
                        // console.log(w2)
                        // console.log(w3)
                        // console.log(vm.value1)
                        // console.log(vm.value2)
                        // console.log(vm.value3)
                        vm.control=control
                        console.log(control)
                        
                    }
                });                
            }
        });

        
    },
    ///////controlConfirm
    controlConfirm(e)
    {
        console.log(e)
        console.log(e.serviceBody)
        var seveice=e
        console.log(seveice)
        var json={"serviceName":seveice,"methodName":seveice.methodName}
        for (var i = 0; i < seveice.params.length; i++) {
            console.log(seveice.params[i].key)
            console.log(seveice.params[i].value)
            json.key="123"
            json.seveice.params[i].key=seveice.params[i].value

                    // keys.push(e.serviceBody.params[i].key);
                    // values.push(e.serviceBody.params[i].value);
                    // // console.log("value"+index+i+":"+valueArr[index][i]);
                    // // console.log("key"+index+i+":"+keyArr[index][i]);
                    // var json = '{';
                    // for (var j = 0; j < keys.length; j++) {
                    //     json += '"' + keys[j] + '":"' + values[j] + '",';
                    // }
                    // json = json.slice(0, json.length - 1);
                    // json += '}';
                }
                console.log(json)
        // $.ajax({
        //             url: "/api/v1/deviceaccess/rpc/"+,
        //             data: json,
        //             contentType: "application/json; charset=utf-8",//post请求必须
        //             dataType: "text",
        //             type: "POST",
        //             success: function (msg) {
        //                 toastr.success("应用成功！");
        //             },
        //             error: function (err) {
        //                 toastr.error("应用失败！");
        //             }
        //         });
 

    },
    handleClose(done)
    {
        vm.DeviceDetailTableData=[]
    },

    ////////////////显示报警信息/////////
    showWarning()
    {
       vm.warningTableData=[]
        $.ajax({
          url:"http://10.112.17.185:8101/api/v1/map/warningAll",
          type:"GET",
          contentType:"application/json;charset=UTF-8",
          dataType:"JSON",
          success:function (req) {
            console.log(req)
            for (var i = 0; i < req.length; i++) {
              var warning = {};
              warning.id = req[i].id;
              warning.deviceid = req[i].deviceid;
              warning.content = req[i].content.message;
              warning.time = new Date(req[i].createdat* 1000).toLocaleString().replace(/:\d{1,2}$/,' ');;
              warning.status=(req[i].status=="false")?'已查看':"未查看"
              vm.warningTableData.unshift(warning);
              vm.dialogWarning=true
            }
          },
          error:function (err) {
            console.log(err)
          }
        })
    },

    switchControl()
    {
        if(vm.input1=="支持")
        {
            console.log(vm.value2)
        }
        else
        {
            alert("该设备不支持此操作")
        }
        

    },
    rangeControl()
    {
        if(vm.input2=="支持")
        {
            console.log(vm.value2)
        }
        else
        {
            alert("该设备不支持此操作")
        }

    },
    inputControl()
    {
        if(vm.input3=="支持")
        {
            console.log(vm.value2)
        }
        else
        {
            alert("该设备不支持此操作")
        }

    },

    /////////////分页//////////////
    handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        this.currentPage = 1;
        this.pageSize = val;
    },
    handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.currentPage = val;
    },

    ////////////////websocket//////
    initWebSocket()
    { //初始化weosocket 　　　　　　　
　　　　　　　　const wsuri = "ws://39.104.189.84:8800/api/warning/webSocket";//ws地址
　　　　　　　　this.websocket = new WebSocket(wsuri);
　　　　　　　　this.websocket.onopen = this.websocketonopen;
　　　　　　　　this.websocket.onerror = this.websocketonerror;
　　　　　　　　this.websocket.onmessage = this.websocketonmessage;
　　　　　　　　this.websocket.onclose = this.websocketclose;
　　　　   },

　　　　　　websocketonopen() 
        {
　　　　　　　　console.log("WebSocket连接成功");
          var data ={tenantId:tenantId}
          this.websocket.send(JSON.stringify(data))
　　　　　　},
　　　　　　websocketonerror(e) { //错误
 　　　　　　 console.log("WebSocket连接发生错误");
　　　　　　},
　　　　　　websocketonmessage(evt){ //数据接收
        window.isJsonString=function(str) {
            try {
                if (typeof JSON.parse(str) == "object") {
                    return true;
                }
            } catch(e) {
            }
            return false;
        }
　　　　　　　　console.log(evt)
                  var received_msg = evt.data;
                  if(isJsonString(evt.data))
                  {
                     toastr.info('报警设备：'+JSON.parse(evt.data).deviceId+'&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;'+'报警信息：'+JSON.parse(evt.data).content);

                     $.ajax({
                       url:'api/3d815/getDeviceInfo/'+JSON.parse(evt.data).deviceId,
                       type:'get',//提交方式
                       dataType:'JSON',//返回字符串，T大写
                       success: function(req){
                        //console.log(req)
                        if(req.siteId==-1)
                        {
                           toastr.warning('设备没有分配站点，请分配！');
                        }
                        else
                        {
                           $.ajax({
                              url:'/api/sites/'+req.siteId,
                              type:'get',//提交方式
                              dataType:'JSON',//返回字符串，T大写
                              success: function(req){
                                 console.log(req.sites)
                                 if(req.sites[0].tenantId==tenantId)
                                 {
                                     point=new BMap.Point(req.sites[0].longtitude,req.sites[0].latitude);
                                     map.centerAndZoom(point, 20);
                                     var allOverlay = map.getOverlays();
                                     //console.log(allOverlay)
                                     for (var i = 1; i < allOverlay.length ; i++){
                                             //console.log(allOverlay[i].toString())
                                             if(allOverlay[i].toString()=="[object Marker]")
                                             {
                                                 //console.log(allOverlay[i].getLabel())
                                                 if(allOverlay[i].getLabel()!=null)
                                                 {
                                                     if(allOverlay[i].getLabel().content == req.sites[0].id)
                                                     {
                                                         var myIcon = new BMap.Icon(src="../static/baidu/img/008h.gif", new BMap.Size(25, 40), {anchor: new BMap.Size(15, 25), imageOffset: new BMap.Size(0, 0),imageSize:new BMap.Size(30, 30)}); // 指定定位位置  });
                                                         allOverlay[i].setIcon(myIcon);
                                                     }
                                                 }
                                             }
                                     }
                                 }
                              },
                              error:function(error)
                              {
                                  toastr.error(error.message);
                              }
                           })
                        }
                       },
                       error:function(error)
                       {
                           toastr.error(error.message);
                       }
                   })
                  }
　　　　　　},

　　　　　　websocketsend(agentData){//数据发送
　　　　　　　　this.websocket.send(agentData);
　　　　　　},

　　　　　 websocketclose(e){ //关闭
　　　　　　　　console.log("connection closed (" + e.code + ")");
　　　　　},

    }


   }

</script>
<style scoped>
</style>
