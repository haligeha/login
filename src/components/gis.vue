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
        <el-button type="primary" @click="trackAll">历史巡检线路</el-button>
      </ol>

    </div>

    <div class="pageBody" style="width:100%;height:100%;">
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
          <el-table-column property="address" label="操作" align="right" width="230">
            <template slot-scope="scope">
              <el-button size="mini" type="success" @click="warningChange(scope.row)">改变状态</el-button>
              <el-button size="mini" type="primary" @click="deviceCheck(scope.row.deviceid)">查看详情</el-button>
              <el-button size="mini" type="warning" @click="videoCkeck(scope.row)">查看视频</el-button>
              <el-button size="mini" type="danger"  @click="informAPP(scope.row)">通知人员</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="block">
          <el-pagination align='center' @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage":total="warningTableData.length" :page-size="pageSize":page-sizes="pageSizes"  layout="total, sizes, prev, pager, next, jumper" >
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
            <el-col :span="8" v-for="(x) in control">
              <el-form >
                <span>{{x.serviceName}}</span>
                <el-form  v-for="(w,index) in x.serviceBody.params">
                  <el-form-item >
                    <el-col :span="8">{{w.key}}({{index}})</el-col>
                    <el-col :span="8">
                      <el-switch v-if="w.type==2" v-model="w.value" ></el-switch>
                      <el-input v-if="w.type==3" v-model="w.value" type="number"></el-input>
                      <el-input v-if="w.type==1" v-model="w.value" ></el-input>
                    </el-col>
                  </el-form-item>
                </el-form>
                <el-button size="mini" @click="controlConfirm(x)">确定</el-button>
              </el-form>
            </el-col>
          </el-row>
        </el-dialog>

      </el-dialog>


      <!-- 站点设备 -->
      <el-dialog title="站点设备":visible.sync="dialogSiteDevice" @close='handleClose' width="60%">
        <el-table :data="SiteDeviceTableData">
          <el-table-column property="id" label="设备ID" width="250"></el-table-column>
          <el-table-column property="deviceName" label="设备名称" ></el-table-column>
          <el-table-column property="deviceType" label="设备类型"></el-table-column>
          <el-table-column property="deviceTime" label="创建时间" width="200"></el-table-column>
          <el-table-column property="address" label="操作">
            <template slot-scope="scope">
              <el-button size="mini" @click="deviceCheck(scope.row.id)">查看详情</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="prePage">上一页</el-button>
          <el-button type="primary" @click="nextPage()">下一页</el-button>
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
        <el-table :data="siteTableData.slice((currentPage-1)*pageSize,currentPage*pageSize)" style="width: 98%;">
          <el-table-column label="站点ID" prop="id" ></el-table-column>
          <el-table-column label="站点名" prop="siteName"></el-table-column>
          <el-table-column label="创建时间" prop="createdat"></el-table-column>
          <el-table-column>
            <template slot-scope="scope">
              <el-button size="mini" @click="check(true,scope.row)">站点设备</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="block">
          <el-pagination align='center' @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage":total="siteTableData.length" :page-size="pageSize" :page-sizes="pageSizes"  layout="total, sizes, prev, pager, next, jumper" >
          </el-pagination>
        </div>
      </el-dialog>

      <el-dialog title="历史巡检线路":visible.sync="dialogTrackAll" @close='handleClose' width="50%">
        <el-table :data="trackAllTableData.slice((currentPage-1)*pageSize,currentPage*pageSize)">
          <el-table-column label="线路ID" prop="id" ></el-table-column>
          <el-table-column label="用户ID" prop="tenantid" ></el-table-column>
          <el-table-column label="巡检人员名称" prop="stuffName"></el-table-column>
          <el-table-column label="创建时间" prop="createdat" width="200"></el-table-column>
          <el-table-column>
            <template slot-scope="scope">
              <el-button size="mini" @click="trackCheck(scope.row.id)">查看线路</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="block">
          <el-pagination align='center' @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage":total="trackAllTableData.length" :page-size="pageSize":page-sizes="pageSizes"  layout="total, sizes, prev, pager, next, jumper" >
          </el-pagination>
        </div>
      </el-dialog>

    </div>
  </div>
</template>

<script>
  import { Message } from 'element-ui';
  import { MessageBox } from 'element-ui';
  import { Notification } from 'element-ui';
  import warnIcon from '../../static/baidu/img/008h.gif'; //以import的方式导入图片文件
  import BMap from 'BMap'
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
    filters:{

    },

    data() {
      return {
        radio: '1',
        control:'',
        pipeColor: null,
        renameMarker:'',
        renameSiteId:'',
        siteReqArray:[],
        siteTableData:[],
        warningTableData:[],
        DeviceDetailTableData:[],
        SiteDeviceTableData:[],
        trackAllTableData:[],
        dialogDraw: false,
        dialogAddVisible:false,
        dialogWarning:false,
        dialogframeSelection:false,
        dialogrenameSite:false,
        dialogSiteDevice:false,
        dialogDeviceDetail:false,
        dialogTrackAll:false,
        form:{},
        websocket: null,
        websocketApp:null,
        currentPage: 1, // 当前页码
        pageSize: 5 ,// 每页的数据条数
        pageSizes:[5, 10, 100]
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
        for (var i = 0; i <= 5; i++) {
          console.log(parseInt(Math.random()*(9+1),10))
        }
        window.tenantId=localStorage.getItem("tenant_id")
        //console.log(localStorage.getItem("auth"))
        var vm=this
        window.vm=vm
        console.log(vm)
        var map = new BMap.Map("allmap",{enableMapClick:false});    // 创建Map实例]
        window.map = map
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

// var polylinePointSum3=[]
// var i=0;
//  var evt =[{"tenantId":"2","staffName":"err","data":[{"longtitude":101,"latitude":51}]},
//  {"tenantId":"2","staffName":"err","data":[{"longtitude":100,"latitude":50}]},
//  {"tenantId":"2","staffName":"err","data":[{"longtitude":102,"latitude":52}]},
//  {"tenantId":"2","staffName":"err","data":[{"longtitude":103,"latitude":53}]},]
//             var myIcon = new BMap.Icon("http://lbsyun.baidu.com/jsdemo/img/Mario.png", new BMap.Size(32, 70), {    //小车图片
//                         //offset: new BMap.Size(0, -5),    //相当于CSS精灵
//                         imageOffset: new BMap.Size(0, 0)    //图片的偏移量。为了是图片底部中心对准坐标点。
//                         });
//         var carMk1
//         var loop=setInterval(function(){

//                         var row1 = {lng:evt[i].data[0].longtitude,lat:evt[i].data[0].latitude};
//                         polylinePointSum3.push(row1);
//                 if(polylinePointSum3.length==1)
//                         {
//                             carMk1= new BMap.Marker(polylinePointSum3[0],{icon:myIcon});
//                             map.addOverlay(carMk1);
//                         }

//                         if(polylinePointSum3.length>1)
//                         {
//                             var polyline = new BMap.Polyline([
//                             new BMap.Point(polylinePointSum3[polylinePointSum3.length-2].lng,polylinePointSum3[polylinePointSum3.length-2].lat),
//                             new BMap.Point(polylinePointSum3[polylinePointSum3.length-1].lng,polylinePointSum3[polylinePointSum3.length-1].lat)
//                             ], {strokeColor:"red", strokeWeight:6, strokeOpacity:0.5});
//                             map.addOverlay(polyline);
//                             //console.log(polylinePointSum3[j-1])
//                             carMk1.setPosition(new BMap.Point(polylinePointSum3[polylinePointSum3.length-1].lng,polylinePointSum3[polylinePointSum3.length-1].lat));
//                         }

// i++;

//         },2000)





        window.getSites=function()
        {
          $.ajax({
            url: '/api/v1/map/sitesAll',
            type: 'get',
            async : false,
            dataType: 'json',
            contentType: 'application/json;charset=UTF-8',
            error:function(err){
              console.log(err)
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
          MessageBox.confirm('确认删除站点?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
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
                  url:'/api/v1/map/sites/?sitesId='+reqArray[i].id,
                  type:'DELETE',//提交方式
                  dataType:'JSON',//返回字符串，T大写
                  success: function(req)
                  {
                    Message.success({message: '删除成功'});
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
          }).catch(() => {
            Message({message: '已取消删除'});
          });

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

        window.addContent=function (tenantId,id,name,longtitude,latitude,date)
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
            '<td>'+date+'</td>'+
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
          url: '/api/v1/map/sitesAll',
          type: 'get',
          async : false,
          dataType: 'json',
          error:function(error){
            console.log(error)
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
              var date=vm.timestamp(req[i].createdat)
              var content =addContent(tenantId,req[i].id,req[i].name,req[i].longtitude,req[i].latitude,date)
              var marker =addMarkers(req[i].id,req[i].longtitude,req[i].latitude)
              addClickHandler(content,marker);

            }
            markerClusterer = new BMapLib.MarkerClusterer(map, {markers:markers});
          }
        });

//////////////管廊显示///////////

        $.ajax({
          url: '/api/v1/map/pipeAll',
          type: 'get',
          async : false,
          dataType: 'json',
          contentType: 'application/json;',

          error:function(){
            Message.error({message: '获取管廊失败'});
          },
          success: function(req) {
            console.log(req)
            for (var i = 0; i < req.length; i++) {
              pipeIdArray.push(req[i].id);
              pipeNameArray.push(req[i].name);
              pipeColorArray.push(req[i].pipecolor);
              pipeWidthArray.push(req[i].pipewidth);
              pipeTypeArray.push(req[i].pipetype);
              pipeDataArray.push(vm.timestamp(req[i].createdat));
              //console.log($.parseJSON(req.pipes[i].drawpoint).point)
              //console.log(req[i].drawpoint.point)
              polylinePointSum.push(req[i].drawpoint.point);
            }
            //console.log(polylinePointSum)
            pipeShow(1,polylinePointSum,pipeIdArray,pipeNameArray,pipeColorArray,pipeWidthArray,pipeTypeArray,pipeDataArray);

          }
        });

        $.ajax({
          url: '/api/v1/map/patroltrackAll',
          type: 'get',
          async : false,
          dataType: 'json',
          contentType: 'application/json;',

          error:function(){
            Message.error({message: '获取巡检线路失败'});
          },
          success: function(req) {
            console.log(req)
            for (var i = 0; i < req.length; i++) {
              trackpipeIdArray.push(req[i].id);
              trackpipeNameArray.push(req[i].name);
              trackpipeColorArray.push(req[i].pipecolor);
              trackpipeWidthArray.push(req[i].pipewidth);
              trackpipeTypeArray.push(req[i].pipetype);
              trackpipeDataArray.push(vm.timestamp(req[i].createdat));
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
                //console.log(drawPoint)
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
                  width : 150,     // 信息窗口宽度
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
                  '<td>'+pipeDataArray[i]+
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
                  MessageBox.confirm('确认删除管廊?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                  }).then(() => {
                    for(i=0;i<polylinePointSum.length;i++)
                    {
                      if(JSON.stringify(polylinePointSum[i]) == JSON.stringify(polyline.getPath()))
                      {
                        idSign=pipeIdArray[i]
                      }
                    }
                    console.log('http://10.112.17.185:8101/api/v1/map/pipe?pipeId='+idSign)
                    $.ajax({
                      url: '/api/v1/map/pipe?pipeId='+idSign,
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
                  }).catch(() => {
                    Message({message: '已取消删除'});
                  });
                  // var mymessage=confirm("确认删除站点？");
                  // if(mymessage==true)
                  // {

                  // }
                  // else if(mymessage==false)
                  // {

                  // }
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
                    url: '/api/v1/map/pipe?pipeId='+idSign,
                    type: 'get',
                    async : false,
                    dataType: 'json',
                    contentType: 'application/json;',

                    error:function(){
                      Message.error({message: '失败'});
                    },
                    success: function(req) {
                      console.log(req)
                      var draw={point:polyline.getPath()}
                      var draw1=JSON.stringify(draw)
                      console.log(draw1)
                      console.log(JSON.stringify({id:req.id,name:req.name,tenantid:req.tenantid,pipecolor:req.pipecolor,pipewidth:req.pipewidth,pipetype:req.pipetype,drawpoint:draw1,createdat:req.createdat}))
                      $.ajax({
                        url:'/api/v1/map/pipe',
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
                          Message.error({message: '错误'});
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
                  width : 225,     // 信息窗口宽度
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
                  '<td>'+pipeDataArray[i]+'</td>'+
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
                  MessageBox.confirm('确认删除巡检线路?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                  }).then(() => {
                    for(i=0;i<polylinePointSum.length;i++)
                    {
                      if(JSON.stringify(polylinePointSum[i]) == JSON.stringify(polyline.getPath()))
                      {
                        idSign=pipeIdArray[i]
                      }
                    }
                    $.ajax({
                      url: '/api/v1/map/patroltrack/?trackId='+idSign,
                      type: 'delete',
                      error:function(){
                        Message.error({message: '删除失败'});
                      },
                      success: function(req) {
                        //toastr.warning('修改完成')
                        window.location.reload();
                      }
                    });

                  }).catch(() => {
                    Message({message: '已取消删除'});
                  });
                  // var mymessage=confirm("确认删除站点？");
                  // if(mymessage==true)
                  // {

                  // }
                  // else if(mymessage==false)
                  // {

                  // }
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
                    url: '/api/v1/map/patroltrack?trackId='+idSign,
                    type: 'get',
                    async : false,
                    dataType: 'json',
                    contentType: 'application/json;',

                    error:function(){
                      Message.error({message: '保存失败'});
                    },
                    success: function(req) {
                      console.log(req)
                      var draw={point:polyline.getPath()}
                      var draw1=JSON.stringify(draw)
                      console.log(draw1)
                      console.log(JSON.stringify({id:req.id,name:req.name,tenantid:req.tenantid,pipecolor:req.pipecolor,pipewidth:req.pipewidth,pipetype:req.pipetype,drawpoint:draw1,createdat:req.createdat}))
                      $.ajax({
                        url:'/api/v1/map/patroltrack',
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
                          Message.error({message: '保存错误'});
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
          url:"/api/v1/map/sites",
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
            var content =addContent(tenantId,msg.id,msg.name,msg.longtitude,msg.latitude,year,month,date)
            var marker =addMarkers(msg.id,msg.longtitude,msg.latitude,true)
            addClickHandler(content,marker);
            //toastr.warning ("添加成功 ");
          },
          error:function (err) {
            console.log(err)
            Message.error({message: '添加信息发送失败'});
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
          url: '/api/v1/map/sites?sitesId='+vm.renameSiteId,
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
              url:'/api/v1/map/sites',
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
                Message.error({message: '错误'});
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
        vm.SiteDeviceTableData=[];
        for (var i = 0; i < req.data.length; i++) {
          var siteDeviceData = {};
          siteDeviceData.id = req.data[i].id;
          siteDeviceData.deviceName = req.data[i].name;
          siteDeviceData.deviceType = req.data[i].deviceType;
          siteDeviceData.deviceTime = vm.timestamp(req.data[i].createdTime);
          vm.SiteDeviceTableData.push(siteDeviceData);
        }
        vm.dialogSiteDevice=true
      },

      //////////站点设备/////////
      check(sign,row){
        console.log(sign)
        if(sign==true)
        {var url='/api/v1/deviceaccess/sitedevices/'+tenantId+'/'+row.id+'?limit=5';sitesID=row.id}
        else
        {var url='/api/v1/deviceaccess/sitedevices/'+tenantId+'/'+row+'?limit=5';}
        console.log(url)
        $.ajax({
          headers: {"Authorization": "Bearer"+localStorage.getItem("auth")},
          url: url,
          type: 'get',
          dataType: 'json',
          contentType: 'application/json;',
          error:function(err){
            console.log(err)
          },
          success: function(req) {
            vm.showSiteDevice(req)
            if(req.nextPageLink!=null)
            {
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
            headers: {"Authorization": "Bearer"+localStorage.getItem("auth")},
            url:'/api/v1/deviceaccess/sitedevices/'+tenantId+'/'+sitesID+'?limit=5&idOffset='+idOffset+'&textOffset='+textOffset,
            contentType: "application/json; ",
            async: false,
            type:"GET",
            success:function(req) {
              pageNum++;
              vm.showSiteDevice(req)
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
              console.log(err)
            }
          });
        }
        else
        {
          Message.warning({message: '当前已是最后一页！'});
        }
      },

      //上一页
      prePage()
      {
        if(pageNum == 1){
          Message.warning({message: '当前已是第一页！'});
        }
        else if(pageNum == 2){
          jQuery.ajax({
            headers: {"Authorization": "Bearer"+localStorage.getItem("auth")},
            url:"/api/v1/deviceaccess/sitedevices/"+tenantId+'/'+sitesID+"?limit=5",
            contentType: "application/json; charset=utf-8",
            //async: false,
            type:"GET",
            success:function(req) {
              pageNum--;
              if(req.data.length != 0){
                vm.showSiteDevice(req)
                idOffset = req.nextPageLink.idOffset;
                textOffset = req.nextPageLink.textOffset;
                hasNext = req.hasNext;
                preDeviceId.push(idOffset);
                preDeviceName.push(textOffset);
              }
            },
            error:function(err){
              console.log(err)
            }
          });
        }else{
          jQuery.ajax({
            headers: {"Authorization": "Bearer"+localStorage.getItem("auth")},
            url:"/api/v1/deviceaccess/sitedevices/"+tenantId+'/'+sitesID+"?limit=5&idOffset="+preDeviceId[pageNum-3]+"&textOffset="+preDeviceName[pageNum-3],
            contentType: "application/json; charset=utf-8",
            async: false,
            type:"GET",
            success:function(req) {
              pageNum--;
              vm.showSiteDevice(req)
              idOffset = req.nextPageLink.idOffset;
              textOffset = req.nextPageLink.textOffset;
              hasNext = req.hasNext;
              preDeviceId.push(idOffset);
              preDeviceName.push(textOffset);

            },
            error:function(err){
              console.log(err)
            }
          });
        }
      },


      ////////////////显示报警信息/////////
      showWarning()
      {
        vm.warningTableData=[]
        $.ajax({
          url:"/api/v1/map/warningAll",
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
              warning.time = vm.timestamp(req[i].createdat);
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

      ///////报警状态改变//////////
      warningChange(row)
      {
        $.ajax({
          url: '/api/v1/map/warning?warnId='+row.id,
          type: 'get',
          async : false,
          dataType: 'json',
          contentType: 'application/json;',

          error:function(err){
            console.log(err)
          },
          success: function(req) {
            console.log(req)
            console.log(JSON.stringify({id:req.id,tenantid:tenantId,deviceid:req.deviceid,content:req.content,createdat:req.createdat,status:"true"}))
            $.ajax({
              url:'/api/v1/map/warning',
              data:JSON.stringify({id:req.id,tenantid:tenantId,deviceid:req.deviceid,content:req.content,createdat:req.createdat,status:"true"}),
              type:'put',//提交方式
              //dataType: 'json',
              contentType: "application/json",

              success: function(req){
                console.log(req)
              },
              error:function(error)
              {
                console.log(error)
              }
            });
          }
        });
      },

      ////////////////报警设备////////
      deviceCheck(row)
      {
        var abilityType=[]
        console.log(row)
        $.ajax({
          headers: {"Authorization": "Bearer"+localStorage.getItem("auth")},
          url: '/api/v1/deviceaccess/data/alllatestdata/'+row,
          type: 'get',
          dataType: 'json',
          contentType: 'application/json;charset=UTF-8',
          error:function(err){
            console.log(err)
          },
          success: function(req) {
            console.log(req)
            vm.dialogDeviceDetail=true
            for (var i = 0; i < req.length; i++) {
              var deviceData = {};
              deviceData.updateTime = vm.timestamp(req[i].ts);
              deviceData.updateKey = req[i].key;
              deviceData.updateValue = req[i].value;
              vm.DeviceDetailTableData.push(deviceData);
            }

          }
        });

        $.ajax({
          headers: {"Authorization": "Bearer"+localStorage.getItem("auth")},
          url: '/api/v1/deviceaccess/device/'+row,
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
                vm.control=[]
              },
              success: function(req) {

                console.log(req)
                var control=[]
                for (var i = 0; i < req.length; i++) {
                  var abilityDesJson = JSON.parse(req[i].abilityDes);//将所有abilityDes（string）转成JSON
                  //console.log(abilityDesJson);
                  control.push(abilityDesJson)
                  var params = abilityDesJson.serviceBody.params;
                  vm.control1=params


                }
                control.deviceid=row;
                vm.control=control
                console.log(control)

              }
            });
          }
        });


      },
      ///////控制确定///////////
      controlConfirm(e)
      {
        console.log(e)
        console.log(e.serviceBody)
        console.log(e.serviceBody.params.length)
        var json = '{';
        for (var i = 0; i < e.serviceBody.params.length; i++) {
          json += '"' + e.serviceBody.params[i].key + '":"' + e.serviceBody.params[i].value + '",';
        }
        json += '"' + "serviceName" + '":"' + e.serviceName + '",';
        json += '"' + "methodName" + '":"' + e.serviceBody.methodName+ '"' ;
        json += '}';
        console.log(json)
        var requestId=parseInt(Math.random()*(10000-10+1)+10,10);
        $.ajax({
          headers: {"Authorization": "Bearer"+localStorage.getItem("auth")},
          url: "/api/v1/deviceaccess/rpc/"+vm.control.deviceid+'/'+requestId,
          data: json,
          contentType: "application/json; charset=utf-8",//post请求必须
          dataType: "text",
          type: "POST",
          success: function (req) {
            console.log(req)
            Message.success({message: '控制成功！'});
          },
          error: function (err) {
            console.log(err)
            Message.error({message: '控制失败！'});
          }
        });


      },

      //////////查看视频///////
      videoCkeck(row)
      {
        let routeData = this.$router.resolve({ path: '/hello' });
        window.open(routeData.href, '_blank');
        //this.$router.go({'/hello')};
      },

      //////////通知APP///////
      informAPP(row)
      {

      },

      ///////巡检线路///////////
      trackAll()
      {
        vm.trackAllTableData=[]
        $.ajax({
          url: "http://10.112.17.185:8101/api/v1/map/trackAll",
          contentType: "application/json; charset=utf-8",//post请求必须
          dataType: "json",
          type: "get",
          success: function (req) {
            console.log(req)
            for (var i = 0; i < req.length; i++) {
              var track = {};
              track.id = req[i].id;
              track.stuffName = req[i].staffname;
              track.tenantid = req[i].tenantid;
              track.createdat = vm.timestamp(req[i].createdat);
              vm.trackAllTableData.unshift(track);
            }
            vm.dialogTrackAll=true
          },
          error: function (err) {
            console.log(err)
          }
        });
      },
      trackCheck(row)
      {
        //@TODO url带有http
        $.ajax({
          url: "http://10.112.17.185:8101/api/v1/map/track?trackId="+row,
          contentType: "application/json; charset=utf-8",//post请求必须
          dataType: "json",
          type: "get",
          success: function (result) {
            vm.dialogTrackAll=false
            console.log(result)
            var polylinePointSum=result.drawpoint.point
            var drawPoint=[]
            for(var i=0;i<polylinePointSum.length;i++)
            {
              var polylinePoint=new BMap.Point(polylinePointSum[i].lng,polylinePointSum[i].lat)
              drawPoint.push(polylinePoint)
              //console.log(drawPoint)
            }
            var polyline = new BMap.Polyline(drawPoint);
            map.addOverlay(polyline);
            map.setViewport(polyline.getBounds());
          },
          error: function (err) {
            console.log(err)
          }
        });
      },

      handleClose(done)
      {
        vm.DeviceDetailTableData=[]
      },

      /////////////分页//////////////
      handleSizeChange(val)
      {
        console.log(`每页 ${val} 条`);
        this.currentPage = 1;
        this.pageSize = val;
      },
      handleCurrentChange(val)
      {
        console.log(`当前页: ${val}`);
        this.currentPage = val;
      },

      ////////////////websocket//////
      initWebSocket()
      {
        //初始化报警weosocket 　　　　　　　
// 　　　　　　　　const wsuri = "ws://39.104.189.84:8800/api/warning/webSocket";//ws地址
// 　　　　　　　　this.websocket = new WebSocket(wsuri);
// 　　　　　　　　this.websocket.onopen = this.websocketonopen;
// 　　　　　　　　this.websocket.onerror = this.websocketonerror;
// 　　　　　　　　this.websocket.onmessage = this.websocketonmessage;
// 　　　　　　　　this.websocket.onclose = this.websocketclose;
        //APP定位websocket
        const wsuriApp = "ws://10.112.17.185:8102/api/v1/map/websocket?username=pf_3&usertype=consumer&sessionId=pf";//ws地址
        //const protocol="{"usertype":"consumer","username":"pf_3","sessionId":"pf"}"
        this.websocketApp = new WebSocket(wsuriApp);
        this.websocketApp.onopen = this.websocketonopenApp;
        this.websocketApp.onerror = this.websocketonerror;
        this.websocketApp.onmessage = this.websocketonmessageApp;
        this.websocketApp.onclose = this.websocketclose;
      },
      //报警ws
      websocketonopen() {
        console.log("WebSocket连接成功-报警");
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
          Notification ({
            title: '报警提示',
            message: '报警设备：'+JSON.parse(evt.data).deviceId+';报警信息：'+JSON.parse(evt.data).content,
            duration: 0
          });
          $.ajax({
            headers: {"Authorization": "Bearer"+localStorage.getItem("auth")},
            url: '/api/v1/deviceaccess/device/'+JSON.parse(evt.data).deviceId,
            type: 'get',
            dataType: 'json',
            contentType: 'application/json;charset=UTF-8',
            error:function(err){
              console.log(err)
            },
            success: function(req) {
              console.log(req)
              if(req.siteId==null)
              {
                Notification ({
                  title: '报警提示',
                  message:'该设备没有分配站点',
                  duration: 0,
                  type: 'warning'
                });
              }
              else
              {
                $.ajax({
                  url:'/api/v1/map/sites?sitesId='+req.siteId,
                  type:'get',//提交方式
                  dataType:'JSON',//返回字符串，T大写
                  success: function(req){
                    console.log(req)
                    if(req.tenantid==tenantId)
                    {
                      var point=new BMap.Point(req.longtitude,req.latitude);
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
                            if(allOverlay[i].getLabel().content == req.id)
                            {
                              var myIcon = new BMap.Icon( warnIcon, new BMap.Size(25, 40), {anchor: new BMap.Size(15, 25), imageOffset: new BMap.Size(0, 0),imageSize:new BMap.Size(30, 30)}); // 指定定位位置  });
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
            }
          });
        }
      },
//     websocketsend(agentData){//数据发送
// 　　　　　　　this.websocket.send(agentData);
// 　　　},
      websocketclose(e)
      { //关闭
        console.log("connection closed (" + e.code + ")");
      },

      ///////////App定位ws////////
      websocketonopenApp() {
        console.log("WebSocket连接成功-App");
      },
      websocketonmessageApp(evt){
        var tidArray=[]
        // if(!(tidArray.indexOf(evt.tenantId) > -1))
        // {
        //     tidArray.push(evt.tenantId)
        // }
        // console.log(tidArray)
        console.log(evt.data)
        //console.log(JSON.parse(evt.data))

        //console.log(JSON.parse(evt.data)['data'][0])
        var req=JSON.parse(evt.data)['data'][0]
        //console.log(JSON.parse(evt.data).data)
        var polylinePointSum3=[]
        var myIcon = new BMap.Icon("http://lbsyun.baidu.com/jsdemo/img/Mario.png", new BMap.Size(32, 70), {
          imageOffset: new BMap.Size(0, 0)    //图片的偏移量。为了是图片底部中心对准坐标点。
        });
        var carMk1;
        console.log(Math.random()*5)
        var row1 = {lng:req.longtitude,lat:req.latitude};
        //console.log(row1)

        polylinePointSum3.push(row1);
        //console.log(polylinePointSum3)


        if(polylinePointSum3.length==1)
        {
          carMk1= new BMap.Marker(polylinePointSum3[0],{icon:myIcon});
          map.addOverlay(carMk1);
        }

        if(polylinePointSum3.length>1)
        {
          var polyline = new BMap.Polyline([
            new BMap.Point(polylinePointSum3[polylinePointSum3.length-2].lng,polylinePointSum3[polylinePointSum3.length-2].lat),
            new BMap.Point(polylinePointSum3[polylinePointSum3.length-1].lng,polylinePointSum3[polylinePointSum3.length-1].lat)
          ], {strokeColor:"red", strokeWeight:6, strokeOpacity:0.5});
          map.addOverlay(polyline);
          //console.log(polylinePointSum3[j-1])
          carMk1.setPosition(new BMap.Point(polylinePointSum3[polylinePointSum3.length-1].lng,polylinePointSum3[polylinePointSum3.length-1].lat));
        }

      },

      /////////时间戳转换//////
      timestamp(int)
      {

        var val = JSON.parse(int)
        let date = new Date(val);
        let y = date.getFullYear();
        let MM = date.getMonth() + 1;
        MM = MM < 10 ? ('0' + MM) : MM;
        let d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        let h = date.getHours();
        h = h < 10 ? ('0' + h) : h;
        let m = date.getMinutes();
        m = m < 10 ? ('0' + m) : m;
        // let s = date.getSeconds();
        // s = s < 10 ? ('0' + s) : s;
        return y + '-' + MM + '-' + d + ' ' + h + ':' + m ;
      }


    }

  }

</script>
<style scoped>
</style>
