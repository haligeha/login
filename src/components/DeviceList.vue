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

    <div id="pageBody">
      <el-table
        :data="tableData"
        :default-sort="{prop:'id',order:'ascending'}"
        style="width:98%;left: 20px;">
        <el-table-column label="序号" prop="id" sortable="" width="90%" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.id}}</span>
          </template>
        </el-table-column>
        <el-table-column label="设备名" prop="deviceName" width="70%" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.deviceName}}</span>
          </template>
        </el-table-column>
        <el-table-column label="父类设备" prop="parentName" width="160%" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.parentName}}</span>
          </template>
        </el-table-column>
        <el-table-column label="厂商" prop="manufacture" width="120%" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.manufacture}}</span>
          </template>
        </el-table-column>
        <el-table-column label="设备类型" prop="deviceType" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.deviceType}}</span>
          </template>
        </el-table-column>
        <el-table-column label="型号" prop="model" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.evaluation}}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" prop="status" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.status}}</span>
          </template>
        </el-table-column>
        <el-table-column label="位置" prop="location" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.location}}</span>
          </template>
        </el-table-column>
      </el-table>
      <el-button @click="nextDeviceInfo()">上一页</el-button>
      <el-button @click="preDeviceInfo()">下一页</el-button>
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
          var showNum=9;
          $.ajax({
            type: "GET",
            dataType: "JSON",
            //  header:"Access-Control-Allow-Origin:  http://10.112.17.185:8100",
            url: "http://10.112.17.185:8086/api/v1/info/alldevices?limit=" + showNum,
            success: function (msg) {
              console.log("信息获取成功" + msg)
              vm.tableData=msg;
            },
            error: function (err) {
              alert("信息获取失败");
            }
          })
        }
      }
    }
</script>

<style scoped>

</style>
