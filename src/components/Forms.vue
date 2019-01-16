<template>
<div class="forms">
  <div id="page-wrapper" >
    <div class="header">
      <h1 class="page-header">
        应急预案
      </h1>
      <ol class="breadcrumb">
        <li><a href="/hello">主页</a></li>
        <li><a href="#">应急预案</a></li>
        <li class="active">数据</li>
      </ol>
    </div>

    <div>
      <el-button size="mini" style="margin-left: 20px" @click="resetForm(),dialogAddVisible=true">添加</el-button>
    </div>

   <div id="pageBody">
     <el-table
       :data="tableDataEme"
       @expand-change="expandChange"
       style="width:98%;left:20px">
       <el-table-column type="expand">
         <template slot-scope="scope">
           <el-form label-position="left" inline class="demo-table-expand">
           <el-form-item label="序号">
             <span>{{scope.row.emergency_id}}</span>
           </el-form-item>
             <el-form-item label="预案名称">
               <span>{{scope.row.name}}</span>
             </el-form-item>
             <el-form-item label="预案类别">
               <span>{{scope.row.category}}</span>
             </el-form-item>
             <el-form-item label="预案级别">
               <span>{{scope.row.level}}</span>
             </el-form-item>
             <el-form-item label="预案关联事件类型">
               <span>{{scope.row.associated_event_type}}</span>
             </el-form-item>
             <el-form-item label="预案内容">
               <span>{{scope.row.content}}</span>
             </el-form-item>
             <el-form-item label="编制单位/部门">
               <span>{{scope.row.department}}</span>
             </el-form-item>
             <el-form-item label="发布日期">
               <span>{{scope.row.release_date|formatDate}}</span>
             </el-form-item>
             <el-form-item label="发布文号">
               <span>{{scope.row.release_number}}</span>
             </el-form-item>
             <el-form-item label="发布单位">
               <span>{{scope.row.issued}}</span>
             </el-form-item>
             <el-form-item label="签发人">
               <span>{{scope.row.signer}}</span>
             </el-form-item>
             <el-form-item label="相关附件">
               <span>{{scope.row.file}}</span>
             </el-form-item>
           </el-form>
         </template>
       </el-table-column>
       <el-table-column label="序号" prop="emergency_id" align="center">
         <template slot-scope="scope">
           <span>{{scope.row.emergency_id}}</span>
         </template>
       </el-table-column>
       <el-table-column label="预案名称" prop="name" align="center">
         <template slot-scope="scope">
           <span>{{scope.row.name}}</span>
         </template>
       </el-table-column>
       <el-table-column label="预案类别" prop="category" align="center">
         <template slot-scope="scope">
           <span>{{scope.row.category}}</span>
         </template>
       </el-table-column>
       <el-table-column label="预案级别" prop="level" align="center">
         <template slot-scope="scope">
           <span>{{scope.row.level}}</span>
         </template>
       </el-table-column>
       <el-table-column label="预案内容" prop="content" align="center">
         <template slot-scope="scope">
           <span>{{scope.row.content}}</span>
         </template>
       </el-table-column>
       <el-table-column label="签发人" prop="signer" align="center">
         <template slot-scope="scope">
           <span>{{scope.row.signer}}</span>
         </template>
       </el-table-column>
       <el-table-column label="操作" align="center">
         <template slot-scope="scope">
           <el-button type="primary" size="mini" @click="handleEditEme(scope.row)">编辑</el-button>
           <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
         </template>
       </el-table-column>
     </el-table>


     <div class="pagination-container" align="right" style="margin-left:20px;margin-right: 4px">
       <el-pagination
         @size-change="handleSizeChange"
         @current-change="handleCurrentChange"
         :current-page.sync="pageInfo.pageCode"
         :page-sizes="pageInfo.pageOption"
         :page-size="pageInfo.pageSize"
         layout="total, sizes, prev, pager, next, jumper"
         :total="pageInfo.totalPage">
       </el-pagination>
     </div>

     <el-dialog title="添加记录":visible.sync="dialogAddVisible">
       <el-form>
         <el-row :gutter="5">
           <el-col :span="10">
         <el-form-item label="预案名称":label-width="formLabelWidth">
           <el-input v-model="form.name" prop="name"></el-input>
         </el-form-item>
           </el-col>
           <el-col :span="10">
         <el-form-item label="预案类别":label-width="formLabelWidth">
           <el-input v-model="form.category" prop="category"></el-input>
         </el-form-item>
           </el-col>
         </el-row>
         <el-row :gutter="5">
           <el-col :span="10">
         <el-form-item label="预案级别":label-width="formLabelWidth">
           <el-select v-model="form.level" prop="level" placeholder="请选择预案级别">
             <el-option label="1" value="1"></el-option>
             <el-option label="2" value="2"></el-option>
             <el-option label="3" value="3"></el-option>
           </el-select>
         </el-form-item>
           </el-col>
           <el-col :span="10">
         <el-form-item label="预案关联事件类型":label-width="formLabelWidth">
           <el-input v-model="form.associated_event_type" prop="associated_event_type"></el-input>
         </el-form-item>
           </el-col>
         </el-row>
         <el-row>
           <el-col :span="10">
         <el-form-item label="预案内容":label-width="formLabelWidth">
           <el-upload class="upload-demo"
                      style="display:inline-block"
                      accept=".pdf,.doc"
                      action="http://10.112.17.185:8100/api/v1/info/upload"
                      multiple=""
                      limit="1"
                      :on-preview="handlePreview"
                      :before-remove="beforeRemove"
                      :on-remove="handleRemove"
                      :on-exceed="handleExceed"
                      :file-list="fileList">
             <el-button slot="trigger" size="small" type="primary" plain="">点我上传</el-button>
             <div slot="tip" class="el-upload__tip">请上传文件（上限1个）</div>
           </el-upload>
         </el-form-item>
           </el-col>
           <el-col :span="10">
             <el-form-item label="相关附件":label-width="formLabelWidth">
               <el-upload action="http://10.112.17.185:8100/api/v1/info/upload"
                          accept=".pdf,.doc"
                          multiple=""
                          :limit="3"
                          :on-exceed="handleExceed"
                          :file-list="attachList">
                 <el-button size="small" type="primary">点击上传</el-button>
                 <div slot="tip" class="el-upload__tip">请上传附件（上限3个）</div>
               </el-upload>
             </el-form-item>
           </el-col>
         </el-row>
         <el-row :gutter="5">
           <el-col :span="10">
         <el-form-item label="编制单位/部门":label-width="formLabelWidth">
           <el-input v-model="form.department" prop="department"></el-input>
         </el-form-item>
           </el-col>
           <el-col :span="10">
         <el-form-item label="发布日期":label-width="formLabelWidth">
           <el-date-picker v-model="form.release_date" type="datetime" placeholder="请选择日期时间" value-format="timestamp">
           </el-date-picker>
         </el-form-item>
           </el-col>
         </el-row>
         <el-row>
           <el-col :span="10">
         <el-form-item label="预案文号":label-width="formLabelWidth">
           <el-input v-model="form.release_number" prop="release_number"></el-input>
         </el-form-item>
           </el-col>
           <el-col :span="10">
         <el-form-item label="发布单位":label-width="formLabelWidth">
           <el-input v-model="form.issued" prop="issued"></el-input>
         </el-form-item>
           </el-col>
         </el-row>
         <el-row>
           <el-col :span="10">
         <el-form-item label="签发人":label-width="formLabelWidth">
           <el-input v-model="form.signer" prop="signer"></el-input>
         </el-form-item>
           </el-col>
         </el-row>
       </el-form>
       <div slot="footer" class="dialog-footer">
         <el-button @click="resetForm,dialogAddVisible=false">取消</el-button>
         <el-button type="primary" @click="handleAddEme">确定</el-button>
       </div>
     </el-dialog>

     <el-dialog title="提示" :visible.sync="dialogDeleteVisible">
       <span>确认删除这条记录吗？</span>
       <span slot="footer" class="dialog-footer">
            <el-button @click="dialogDeleteVisible=false">取消</el-button>
            <el-button type="primary" @click="handleDeleteConfirm">确定</el-button>
          </span>
     </el-dialog>

   </div>
  </div>
  <!-- /. PAGE WRAPPER  -->
</div>

</template>

<script>
  export default {
    filters: {
      formatDate: function (value) {
        var val = JSON.parse(value)
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
        let s = date.getSeconds();
        s = s < 10 ? ('0' + s) : s;
        return y + '-' + MM + '-' + d + ' ' + h + ':' + m + ':' + s;
      }
    },
    data() {
      return {
        tableDataEme: [],
        transID: undefined,
        dialogAddVisible: false,
        dialogEditVisible: false,
        dialogDeleteVisible: false,
        formLabelWidth: "130px",
        form: {
          emergency_id: undefined,
          name: '',
          category: '',
          level: '',
          associated_event_type: '',
          content: '',
          department: '',
          release_date: '',
          release_number: '',
          issued: '',
          signer: '',
          file: ''
        },
        pageInfo: {
          pageCode: 1, //当前页
          pageOption: [3, 5, 10, 20, 50, 100],   //分页选择
          pageSize: 10,     //每页显示记录数
          totalPage: 100  //总记录数
        },
        fileList:[],
        attachList:[]

      }
    },
    created: function () {
      this.getTotalPage()
      this.getTableDataEme()
    },
    methods: {
      getTableDataEme: function (pageSize, pageCode) {
        var vm = this;
        var pageData = {}
        pageData.limit = vm.pageInfo.pageSize;
        pageData.page = vm.pageInfo.pageCode - 1;

        $.ajax({
          type: "GET",
          dataType: "JSON",
          url: "http://10.112.17.185:8100/api/v1/info/emergencyByPage",
          contentType: "application/json;charset=utf-8",
          data: pageData,
          success: function (msg) {
            //alert("加载成功");
            console.log(msg);
            /*  if (msg.ok) {
                var value = msg.data;
                for (var i = 0; i < value.length; i++) {
                  self.push(value[i]);
                }

              }*/
            vm.tableDataEme = msg;
          },
          error: function (err) {
            alert("加载0000失败");
          }
        });
      },
      getTotalPage() {
        var vm = this;
        $.ajax({
          url: "http://10.112.17.185:8100/api/v1/info/emergencyCount",
          type: "GET",
          dataType: "JSON",
          success: function (msg) {
            console.log("信息总条数获取成功： " + msg + "条记录")
            vm.pageInfo.totalPage = msg;
          },
          error: function (err) {
            alert("信息总条数获取失败");
          }
        })
      },
      //pageSize改变时触发
      handleSizeChange(val) {
        this.pageInfo.pageSize = val;
        this.getTableDataEme(this.pageInfo.pageSize, this.pageInfo.pageCode);
      },
      //当前页改变时触发
      handleCurrentChange(val) {
        this.pageInfo.pageCode = val;
        this.getTableDataEme(this.pageInfo.pageSize, this.pageInfo.pageCode);
      },
      expandChange(row, expandedRows) {
        if (expandedRows.length > 1) {
          expandedRows.shift();
        }
      },
      resetForm() {
        this.form = {
          emergency_id: undefined,
          name: '',
          category: '',
          level: '',
          associated_event_type: '',
          content: '',
          department: '',
          release_date: '',
          release_number: '',
          issued: '',
          signer: '',
          file: ''
        }
      },
      handleAddEme() {
          var vm=this;
          var dataAdd={};
          dataAdd=this.form;
          var dataAddString=JSON.stringify(dataAdd);
        $.ajax({
            url:"http://10.112.17.185:8100/api/v1/info/emergency",
            type:"POST",
            contentType:"application/json;charset=utf-8",
            dataType:"JSON",
            data:dataAddString,
            success:function () {
              console.log("添加信息发送成功");
              vm.getTotalPage();
              vm.getTableDataEme();
              vm.dialogAddVisible=false;
              vm.resetForm();
            },
            error:function (err) {
              alert("添加信息发送失败")
            }

      })
      },
      handleEdit(){


      },
      handleDelete(row) {
        this.dialogDeleteVisible = true;
        const index = this.tableDataEme.indexOf(row);
        this.transID = this.tableDataEme[index].emergency_id;
        console.log(this.transID);
      },
      handleDeleteConfirm() {
        var vm = this;
        var dataDelete = {}
        dataDelete.id = this.transID;
        $.ajax({
          url: "http://10.112.17.185:8100/api/v1/info/emergency?id="+dataDelete.id,
          type: "DELETE",
          contentType: "application/json",
          dataType: "text",
          success: function () {
            vm.dialogDeleteVisible = false;
            vm.getTableDataEme()
            vm.getTotalPage()
            console.log("删除成功")
          },
          error: function (err) {
            alert("删除失败")

          }
        })
      },
      handleRemove(file,fileList){
        console.log(file,fileList);
      },
      handlePreview(file){
        console.log(file);
      },
      handleExceed(files,fileList){
        this.$message.warning('当前限制选择1个文件，本次选择了${files.length}个文件，共选择了${files.length+fileList.length}个文件');
      },
      beforeRemove(file,fileList){
        return this.$confirm('确定移除${file.name}?');
      }

    }
  }

</script>

<style>
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 160px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width:50%;
  }
</style>
