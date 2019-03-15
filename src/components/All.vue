<template>
  <div class="forms">
    <div id="page-wrapper" >
      <div class="header">
        <h1 class="page-header">
          应急预案
        </h1>
        <ol class="breadcrumb">
          <li><router-link to="/hello"> <a href="#">主页</a></router-link></li>
          <li><a href="#">应急预案</a></li>
          <li class="active">审批结果</li>
        </ol>
      </div>
      <el-table
        :data="tableData"
        style="width:98%;left: 20px;">
        <el-table-column label="ID" prop="id" sortable="" width="100px" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.id}}</span>
          </template>
        </el-table-column>
        <el-table-column label="预案序号" prop="planId" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.planId}}</span>
          </template>
        </el-table-column>
        <el-table-column label="用户ID" prop="puserId" width="100px" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.userId}}</span>
          </template>
        </el-table-column>
        <el-table-column label="用户名" prop="userName"  align="center">
          <template slot-scope="scope">
            <span>{{scope.row.userName}}</span>
          </template>
        </el-table-column>
        <el-table-column label="审批信息" prop="auditInfo"  align="center">
          <template slot-scope="scope">
            <span>{{scope.row.auditInfo}}</span>
          </template>
        </el-table-column>

      </el-table>

    </div>
  </div>
</template>

<script>
    export default {
      data() {
        return {
          tableData: [],
          search: '',
          transID:undefined,
          formLabelWidth:"120px"
        }
      },
      created: function () { // 在vue初始化时调用//
        this.getTableData();
      },
      methods: {
        getTableData(){
          var vm=this
          $.ajax({
            type: "GET",
            dataType: "JSON",
            url: "/api/v1/user/planAudit",
            success: function (msg) {
              vm.tableData=msg;
            },
            error: function (err) {
              alert("加载0000失败");
            }
          });
        }
      }
    }
</script>

<style scoped>

</style>
