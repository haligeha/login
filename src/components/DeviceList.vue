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
        <el-table-column label="设备ID" prop="id" sortable="" width="250%" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.id}}</span>
          </template>
        </el-table-column>
        <el-table-column label="设备名" prop="deviceName" width="120%" align="center">
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
        <el-table-column label="设备类型" prop="deviceType" align="center"width="90%">
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
        <el-table-column label="站点ID" prop="siteId" align="center"width="90%">
          <template slot-scope="scope">
            <span>{{scope.row.siteId}}</span>
          </template>
        </el-table-column>
      </el-table>

      <el-button @click="preDeviceInfo()">上一页</el-button>
      <el-button @click="nextDeviceInfo()">下一页</el-button>
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
            url: "/api/v1/info/alldevices?limit=" + showNum,
            success: function (msg) {
              console.log("信息获取成功" + msg)
              vm.tableData = msg;
              var last = vm.tableData.length - 1;
              vm.nextDeviceId = vm.tableData[last].id;
              vm.nextDeviceName = vm.tableData[last].name;
              vm.preDeviceIdArr.push(vm.tableData[last].id);
              vm.preDeviceNameArr.push(vm.tableData[last].name);
            },
            error: function (err) {
              alert("信息获取失败");
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
            alert("搜索条件不能为空");
          }
          else {
            var data = {};
            data.siteId = this.search;
            data.limit = 9;
            $.ajax({
              url: "/api/v1/info/devicesBySiteId",
              type: "GET",
              //   contentType:"application/json",
              dataType: "JSON",
              data: data,
              success: function (msg) {
                vm.tableData = msg;
              },
              error: function (err) {
                alert("加载搜索失败")
              }
            })
          }
        },
        nextDeviceInfo: function () {
          var vm = this;
          console.log(vm.nextDeviceId);
          console.log(vm.nextDeviceName);
          var prePageUrl = "/api/v1/info/alldevices?limit=9" + "&idOffset=" + vm.nextDeviceId + "&textOffset=" + vm.nextDeviceName;
          if (vm.nextDeviceId && vm.nextDeviceName) {
            $.ajax({
              url: prePageUrl,
              type: "GET",
              success: function (msg) {
                if (msg.length === 0) {
                  alert("当前已是最后一页！");
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
                alert("当前已是最后一页！");
              }
            });
          }
        },
          preDeviceInfo:function () {
            var vm = this;
            var url = '';
            if (vm.pageNum === 1) {
              alert("当前为首页");
            }
            else {
              if (vm.pageNum === 2) {
                url = "/api/v1/info/alldevices?limit=" + 9;
              } else {
                preDeviceId = vm.preDeviceIdArr[pageNum - 3];
                preDeviceName = vm.preDeviceNameArr[pageNum - 3];
                url = "/api/v1/info/alldevices?limit=９" + "&idOffset=" + preDeviceId + "&textOffset=" + preDeviceName;
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
                  alert("向前翻页失败")
                }

              });
            }
          }
        }

    }
</script>

<style scoped>

</style>
