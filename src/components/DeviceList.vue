<template>
  <div id="page-wrapper" >
    <div class="header">
      <h1 class="page-header">
        设备信息
      </h1>
      <ol class="breadcrumb">
        <li><a href="/hello">主页</a></li>
        <li><a href="#">设备信息</a></li>
        <li class="active">数据</li>
      </ol>

    </div>
    <div class="filter-container">

      <el-input v-model="search" style="width: 150px;left:20px"  placeholder="请输入站点ID" >
      </el-input>
     <el-button icon="el-icon-close" circle @click="getTableData(),resetInfo()" size="mini"></el-button>

      <el-button type="primary" icon="el-icon-search" @click="handleFilterRange()"　style="position:relative;left:10px">搜索</el-button>

    </div>
    <div id="pageBody">
      <el-table
        :data="tableData"
        style="width:98%;left: 20px;">
        <el-table-column label="设备ID" prop="id" sortable="" width="150%" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.id}}</span>
          </template>
        </el-table-column>
        <el-table-column label="设备名" prop="deviceName" width="100%" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column label="父类设备" prop="parentName"  align="center">
          <template slot-scope="scope">
            <span>{{scope.row.parentDeviceId}}</span>
          </template>
        </el-table-column>
        <el-table-column label="厂商" prop="manufacture" width="100%" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.manufacture}}</span>
          </template>
        </el-table-column>
        <el-table-column label="设备类型" prop="deviceType" align="center"width="80%">
          <template slot-scope="scope">
            <span>{{scope.row.deviceType}}</span>
          </template>
        </el-table-column>
        <el-table-column label="型号" prop="model" align="center"width="100%">
          <template slot-scope="scope">
            <span>{{scope.row.model}}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" prop="status" align="center"width="50%">
          <template slot-scope="scope">
            <span>{{scope.row.status}}</span>
          </template>
        </el-table-column>
        <el-table-column label="位置" prop="location" align="center"width="50%">
          <template slot-scope="scope">
            <span>{{scope.row.location}}</span>
          </template>
        </el-table-column>
        <el-table-column label="站点ID" prop="siteId" align="center"width="80%">
          <template slot-scope="scope">
            <span>{{scope.row.siteId}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100%" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="deviceCheck(scope.row.id)">查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-button @click="preDeviceInfo()">上一页</el-button>
      <el-button @click="nextDeviceInfo()">下一页</el-button>

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
    </div>

  </div>
</template>

<script>
    export default {

      data() {
        return {
          tableData: [],
          search: '',
          transID: undefined,
          preDeviceIdArr: [],//用于记录设备列表展示时向前翻页
          preDeviceNameArr: [],//用于设备列表展示时向前翻页
          preDeviceId: '',//用于设备列表展示时向前翻页
          preDeviceName: '',//用于设备列表展示时向前翻页
          nextDeviceId: '',//用于设备列表展示时向后翻页
          nextDeviceName: '',//用于设备列表展示时向后翻页
          dialogSiteDevice:false,//用于设备详情
          dialogDeviceDetail:false,
          form:{},
          DeviceDetailTableData:[],
          control:'',
          pageNum: 1//用于记录当前页号

        }
      },
      created: function () {
        this.getTableData()
      },
      methods: {
        getTableData: function () {
          var vm = this;
          var showNum = 9;
          $.ajax({
            type: "GET",
            dataType: "JSON",
            //  header:"Access-Control-Allow-Origin:  http://10.112.17.185:8100",
            url: "/api/v1/user/alldevices?limit=" + showNum,
            success: function (msg) {

              vm.tableData = msg;
              var last = vm.tableData.length - 1;
              vm.nextDeviceId = vm.tableData[last].id;
              vm.nextDeviceName = vm.tableData[last].name;
              vm.preDeviceIdArr.push(vm.tableData[last].id);
              vm.preDeviceNameArr.push(vm.tableData[last].name);
            },
            error: function (err) {
              console.log("信息获取失败");
            }
          })
          //         nextDeviceId = tableData[last].id;
          //        nextDeviceName = tableData[last].name;
          //        preDeviceIdArr.push(tableData[last].id);
          //        preDeviceNameArr.push(tableData[last].name);
          //       console.log(nextDeviceId);
        },
        resetInfo() {
          var vm = this
          vm.search = '';
        },
        handleFilterRange: function () {
          var vm = this;
          if (vm.search === '') {
            this.$message({
              message: '搜索条件为空',
              type: 'warning'
            });
          }
          else {
            var data = {};
            data.siteId = this.search;
            data.limit = 9;
            $.ajax({
              url: "/api/v1/user/devicesBySiteId",
              type: "GET",
              //   contentType:"application/json",
              dataType: "JSON",
              data: data,
              success: function (msg) {
                vm.tableData = msg;
              },
              error: function (err) {
               console.log(err);
              }
            })
          }
        },
        nextDeviceInfo: function () {
          var vm = this;
          var prePageUrl = "/api/v1/user/alldevices?limit=9" + "&idOffset=" + vm.nextDeviceId + "&textOffset=" + vm.nextDeviceName;
          if (vm.nextDeviceId && vm.nextDeviceName) {
            $.ajax({
              url: prePageUrl,
              type: "GET",
              success: function (msg) {
                if (msg.length === 0) {
                  this.$message({
                    message: '当前为最后一页',
                    type: 'success'
                  });
                }
                else {
                  vm.pageNum++;
                  vm.tableData = msg;
                  var last = vm.tableData.length - 1;
                  vm.nextDeviceId = vm.tableData[last].id;
                  vm.nextDeviceName = vm.tableData[last].name;
                  vm.preDeviceIdArr.push(vm.tableData[last].id);
                  vm.preDeviceNameArr.push(vm.tableData[last].name);
                }


              },
              error: function (err) {
                console.log("err")
              }
            });
          }
        },
        preDeviceInfo:function () {
            var vm = this;
            var url = '';
            if (vm.pageNum === 1) {
              this.$message({
                message: '当前为首页'
              });
            }
            else {
              if (vm.pageNum === 2) {
                url = "/api/v1/user/alldevices?limit=" + 9;
              } else {
                preDeviceId = vm.preDeviceIdArr[pageNum - 3];
                preDeviceName = vm.preDeviceNameArr[pageNum - 3];
                url = "/api/v1/user/alldevices?limit=９" + "&idOffset=" + preDeviceId + "&textOffset=" + preDeviceName;
              }
              $.ajax({
                url: url,
                type: "GET",
                success: function (msg) {
                  vm.pageNum--;
                  vm.tableData = msg;
                  var last = vm.tableData.length - 1;
                  vm.nextDeviceId =  vm.tableData[last].id;
                  vm.nextDeviceName = vm.tableData[last].name;
                },
                error: function (err) {
                 console.log("向前翻页失败")
                }

              });
            }
          },
        ////////////////报警设备////////
        deviceCheck(row)
        {
          var vm=this;
          var abilityType=[]

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

        //时间戳和年月日的转化
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
