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
          <li class="active">未审批预案</li>
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
        <el-table-column label="计划名" prop="planName" width="150px" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.planName}}</span>
          </template>
        </el-table-column>
        <el-table-column label="用户ID" prop="userId" width="100px" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.userId}}</span>
          </template>
        </el-table-column>
        <el-table-column label="用户名" prop="userName" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.userName}}</span>
          </template>
        </el-table-column>
        <el-table-column label="添加日期" prop="addDate"  align="center">
          <template slot-scope="scope">
            <span>{{Hour(scope.row.addDate)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" prop="state" align="center">
          <template slot-scope="scope">
            <span>{{changeFormate(scope.row.state)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100%" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="primary"   @click="examine(scope.row)">审批</el-button>
          </template>
        </el-table-column>

      </el-table>
      <el-dialog title="添加信息":visible.sync="dialogAddVisible">
        <el-form>
          <el-form-item label="待审批号":label-width="formLabelWidth">
            <el-input v-model="form.planId"autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="审批人员ID" :label-width="formLabelWidth">
            <el-input v-model="form.userId" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="审批人员姓名" :label-width="formLabelWidth">
            <el-input v-model="form.userName" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="审批意见" :label-width="formLabelWidth">
            <el-input v-model="form.auditInfo" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="handleReject">拒绝</el-button>
          <el-button type="primary" @click="handleAdd">同意</el-button>
        </div>
      </el-dialog>

    </div>
  </div>
</template>

<script>
    export default {
      data() {
        return {
          dialogAddVisible: false,
          dialogAgreeVisible: false,
          dialogRejectVisible: false,
          tableData: [],
          data: [],
          search: '',
          formLabelWidth:'100px',
          form: {
            id: undefined,
            planId: undefined,
            userId: undefined,
            userName: '',
            auditInfo: ''
          },
          transID: undefined
        }
      },
      created: function () { // 在vue初始化时调用//
        this.getTableData();
      },
      methods: {
        Hour(create_date){
          var date = new Date(create_date * 1000);
          var Y = date.getFullYear() + '-';
          var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
          var D = date.getDate() + ' ';
          var h = date.getHours() + ':';
          var m = date.getMinutes();
          return Y + M + D + h + m;
        },
        changeFormate(a) {
          if (a == 0) {
            a = "未审批"
          }
          return a
        },
        getTableData() {
          var vm = this
          $.ajax({
            type: "GET",
            dataType: "JSON",
            url: "/api/v1/user/noReservePlan",
            success: function (msg) {
         /*     for (var x = 0; x < msg.length; x++) {
                var mm = {};
                mm.id = msg[x].id;
                mm.planName = msg[x].planName;
                mm.userId = msg[x].userId;
                mm.userName = msg[x].userName;
                mm.addDate = Hour(msg[x].addDate);
                mm.state = changeFormate(msg[x].state);
                vm.tableData.push(mm);

              }*/
            vm.tableData=msg;
            },
            error: function (err) {
              alert("加载0000失败");
            }
          });
        },
        examine(row) {
          var vm = this;
          vm.dialogAddVisible = true;
          const index = this.tableData.indexOf(row)
          var currRow = index + 1;
          this.transID = this.tableData[currRow - 1].id;
          this.form.planId = this.transID;
        },
        resetForm() {
          var vm = this
          vm.form = {
            id: undefined,
            planId: undefined,
            userId: undefined,
            userName: '',
            auditInfo: ''
          }
        },
        handleReject(){
          var vm = this;
          vm.reject(this.form.planId)
          var doPost = {};
          doPost.planId = this.form.planId;
          doPost.userId = this.form.userId;
          doPost.userName = this.form.userName;
          doPost.auditInfo = this.form.auditInfo;
          var dataPostString = JSON.stringify(doPost);
          $.ajax({
            url: "/api/v1/user/planAudit",
            type: "POST",
            contentType: "application/json;charset=utf-8",
            dataType: "text",
            data: dataPostString,
            success: function (msg) {
              console.log("success");
              vm.dialogAddVisible = false;
              vm.resetForm();
              vm.getTableData();
              window.location.reload();
            },
            error: function (err) {
              alert("加载0001失败")
            }
          })
        },
        handleAdd() {
          var vm = this;
          var doPost = {};
          doPost.planId = this.form.planId;
          doPost.userId = this.form.userId;
          doPost.userName = this.form.userName;
          doPost.auditInfo = this.form.auditInfo;
          vm.agree(this.form.planId)
          var planInfo = JSON.stringify(doPost);
          $.ajax({
            url: "/api/v1/user/planAudit",
            type: "POST",
            contentType: "application/json;charset=utf-8",
            dataType: "text",
            data: planInfo,
            success: function (msg) {
              console.log("success");
              vm.dialogAddVisible = false;
              vm.resetForm();
              vm.getTableData();
          //    window.location.reload();
            },
            error: function (err) {
              alert("加载0001失败")
            }
          })
        },
        reject(id){
          var vm = this;
          this.transID = id;
          // this.transID=this.row+1;
          console.log(this.transID)
          var dataDelete = {}
          dataDelete.id = this.transID;
          //    var report=JSON.stringify(dataDelete);
          console.log(dataDelete)
          $.ajax({
            url: "/api/v1/user/disagreeReservePlan?id="+dataDelete.id,
            type: "PUT",
            contentType: "application/json",
            dataType: "text",
            //     data:JSON.stringify(dataDelete),
            success: function () {
              vm.dialogAddVisibleVisible = false;
              vm.getTableData();
              //  window.location.reload();
            },
            error: function (err) {
              alert("加载0006失败")
            }
          })
        },
        agree(id) {
          var vm = this;
          this.transID = id;
          // this.transID=this.row+1;
          console.log(this.transID)
          var dataDelete = {}
          dataDelete.id = this.transID;
          //    var report=JSON.stringify(dataDelete);
          console.log(dataDelete)
          $.ajax({
            url: "/api/v1/user/agreeReservePlan?id=" + dataDelete.id,
            type: "PUT",
            contentType: "application/json",
            dataType: "text",
            //     data:JSON.stringify(dataDelete),
            success: function () {
              vm.dialogAddVisibleVisible = false;
              vm.getTableData();
              //     window.location.reload();
            },
            error: function (err) {
              alert("加载0006失败")
            }
          })
        },
      }

    }
</script>

<style scoped>

</style>
