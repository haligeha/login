<template>
  <div id="page-wrapper" >
    <div class="header">
      <h1 class="page-header">
        入廊作业
      </h1>
      <ol class="breadcrumb">
        <li><a href="/hello">主页</a></li>
        <li><a href="#">入廊作业</a></li>
        <li class="active">数据</li>
      </ol>

      </div>

    <div class="filter-container">

      <el-select v-model="listQuery.activityRange" clearable style="width: 120px;left:20px" class="filter-item" @change="resetPageInfo(),handleFilterRange()">
        <el-option v-for="item in rangeOptions" :key="item.key" :label="item" :value="item"></el-option>
      </el-select>
      <!--<el-button class="filter-item" type="mini" icon="el-icon-search" style="margin-left:20px;" @click="handleFilter">搜索</el-button>-->
      <el-button size="mini" style="margin-left: 40px" @click="dialogAddVisible=true">添加</el-button>

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
      <el-table-column label="工期" prop="duration" width="70%" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.duration}}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="date" width="160%" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.date|formatDate}}</span>
        </template>
      </el-table-column>
      <el-table-column label="施工人员数量" prop="work_number" width="120%" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.work_number}}</span>
        </template>
      </el-table-column>
      <el-table-column label="活动范围" prop="activity_range" width="150%" align="center"
                       :filters="[{ text: '管廊1号', value: '管廊1号' }, { text: '管廊2号', value: '管廊2号' },{text:'管廊3号',value:'管廊3号'}]"
                       :filter-method="filterRange"
                       filter-placement="bottom-end">
        <template slot-scope="scope">
          <span>{{scope.row.activity_range}}</span>
        </template>
      </el-table-column>
      <el-table-column label="评价" prop="evaluation" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.evaluation}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="300" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="mini" @click="handleCheck(scope.row)">查看</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
          <el-button size="mini" @click="handleEvaluate(scope.row)">评价</el-button>
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
        <el-form-item label="工期（天）":label-width="formLabelWidth">
          <el-input v-model="form.duration" prop="duration" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="施工人员数量":label-width="formLabelWidth">
          <el-input v-model="form.work_number" prop="work_number" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="活动范围":label-width="formLabelWidth">
          <el-select v-model="form.activity_range" prop="activity_range" placeholder="请选择活动区域">
            <el-option label="管廊1号" value="管廊1号"></el-option>
            <el-option label="管廊2号" value="管廊2号"></el-option>
            <el-option label="管廊3号" value="管廊3号"></el-option>
          </el-select>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm(),dialogAddVisible=false">取消</el-button>
        <el-button type="primary" @click="handleAdd">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="查看详细信息":visible.sync="dialogCheckVisible">
      <el-form>
        <el-form-item label="序号":label-width="formLabelWidth">
          <el-input v-model="form.id" prop="id" disabled=""></el-input>
        </el-form-item>
        <el-form-item label="工期（天）":label-width="formLabelWidth">
          <el-input v-model="form.duration" prop="duration" autocomplete="off" disabled=""></el-input>
        </el-form-item>
        <el-form-item label="创建时间":label-width="formLabelWidth">
          <el-date-picker v-model="form.date" type="datetime" value-format="timestamp" disabled=""></el-date-picker>
        </el-form-item>
        <el-form-item label="施工人员数量":label-width="formLabelWidth">
          <el-input v-model="form.work_number" prop="work_number" autocomplete="off" disabled=""></el-input>
        </el-form-item>
        <el-form-item label="活动范围":label-width="formLabelWidth">
          <el-select v-model="form.activity_range" prop="activity_range" placeholder="请选择活动区域" disabled="">
            <el-option label="管廊1号" value="管廊1号"></el-option>
            <el-option label="管廊2号" value="管廊2号"></el-option>
            <el-option label="管廊3号" value="管廊3号"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="评价":label-width="formLabelWidth">
          <el-input v-model="form.evaluation" prop="evaluation" autocomplete="off" disabled=""></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleCheckConfirm()">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="编辑信息":visible.sync="dialogEditVisible">
      <el-form>
        <el-form-item label="序号":label-width="formLabelWidth">
          <el-input v-model="form.id" prop="id" disabled=""></el-input>
        </el-form-item>
        <el-form-item label="工期（天）":label-width="formLabelWidth">
          <el-input v-model="form.duration" prop="duration" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="创建时间":label-width="formLabelWidth">
          <el-date-picker v-model="form.date" type="datetime" value-format="timestamp" disabled=""></el-date-picker>
        </el-form-item>
        <el-form-item label="施工人员数量":label-width="formLabelWidth">
          <el-input v-model="form.work_number" prop="work_number" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="活动范围":label-width="formLabelWidth">
          <el-select v-model="form.activity_range" prop="activity_range" placeholder="请选择活动区域">
            <el-option label="管廊1号" value="管廊1号"></el-option>
            <el-option label="管廊2号" value="管廊2号"></el-option>
            <el-option label="管廊3号" value="管廊3号"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="评价":label-width="formLabelWidth">
          <el-input v-model="form.evaluation" prop="evaluation" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogEditVisible=false">取消</el-button>
        <el-button type="primary" @click="handleEditConfirm()">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="提示":visible.sync="dialogDeleteVisible" width="30%">
      <span>确认删除这条记录？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogDeleteVisible=false">取消</el-button>
        <el-button type="primary" @click="handleDeleteConfirm()">确定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="作业评价":visible.sync="dialogEvaluateVisible">
      <el-form>
        <el-form-item label="评价">
          <el-input v-model="form.evaluation" prop="evaluation" type="textarea" placeholder="Please input evaluation"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogEvaluateVisible=false">取消</el-button>
        <el-button type="primary" @click="handleEvaluateConfirm()">确定</el-button>
      </span>
    </el-dialog>

  </div>

</div>

</template>

<script>
    export default {
      filters:{
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
          tableData: [],
         //getUrl: 'http://10.112.17.185:8100/api/v1/info/entranceWork',
          search: '',
          transID:undefined,
          listQuery:{
            //sort:'+id',
            activityRange:''
          },
          //sortOptions:[{label:'ID Ascending',key:'+id'},{label:'ID Descending',key:'-id'}],
          rangeOptions:['管廊1号','管廊2号','管廊3号'],
          dialogCheckVisible: false,
          dialogAddVisible:false,
          dialogEditVisible:false,
          dialogDeleteVisible:false,
          dialogEvaluateVisible:false,
          form:{
            id:undefined,
            startDate:'',
            endDate:'',
            UserId:undefined

          },
          formLabelWidth:"120px",
          pageInfo:{
            pageCode:1,  //当前页
            pageOption:[3,5,10,20,50,100],   //分页选项
            pageSize:10,   //每页显示记录数
            totalPage:100   //总记录数
          }
        };
      },
      created: function () {
        this.getTableData()
        this.getTotalPage()
      },
      methods: {
        getTableData(pageSize,pageCode) {
          var vm = this;
          var pageData={}
          pageData.limit=vm.pageInfo.pageSize;
          pageData.page=vm.pageInfo.pageCode-1;
          $.ajax({
            type: "GET",
            dataType: "JSON",
            //  header:"Access-Control-Allow-Origin:  http://10.112.17.185:8100",
            url: "http://10.112.17.185:8100/api/v1/info/entranceWorkByPage",
            data:pageData,
            success: function (msg) {
              console.log("信息获取成功"+msg)
              vm.tableData = msg;
            },
            error: function (err) {
              alert("信息获取失败");
            }
          });
        },
        getTotalPage(){
          var vm=this;
          $.ajax({
            url:"http://10.112.17.185:8100/api/v1/info/entranceWorkCount",
            type:"GET",
            dataType:"JSON",
            success:function (msg) {
              console.log("信息总条数获取成功： "+msg+"条记录")
              vm.pageInfo.totalPage=msg;
            },
            error:function (err) {
              alert("信息总条数获取失败");
            }
          })
        },
        resetForm(){
          this.form={
            id:undefined,
            duration:'',
            work_number:'',
            activity_range:'',
            evaluation:''
          }
        },
        resetPageInfo(){
          this.pageInfo={
            pageCode:1,  //当前页
            pageOption:[3,5,10,20,50,100],   //分页选项
            pageSize:10,   //每页显示记录数
            totalPage:100   //总记录数
          }
        },
        handleAdd(){
          var vm=this
          this.form.date=new Date().getTime();
          var dataPost ={};
          dataPost.work_number = this.form.work_number;
          dataPost.duration = this.form.duration;
          dataPost.activity_range = this.form.activity_range;
          dataPost.date = this.form.date;
          console.log(dataPost);
          var dataPostString = JSON.stringify(dataPost);
          $.ajax({
            url:"http://10.112.17.185:8100/api/v1/info/entranceWork",
            type:"POST",
            contentType: "application/json;charset=utf-8",
            dataType:"JSON",
            data:dataPostString,
            success:function(msg){
              console.log("添加信息发送成功"+msg);
              vm.getTableData();
              vm.getTotalPage();
              vm.dialogAddVisible=false;
              vm.resetForm();
              /*dialogAddVisible=false,
              vm.tableData=msg;
              this.resetForm();
              this.$nextTick(()=>{
                this.$refs['dataForm'].clearValidate()
              });*/
            },
            error:function (err) {
              alert("添加信息发送失败")
            }
          })

        },
        sortChange(){},
        handleFilter(){

        },
        handleFilterRange(activityRange,pageSize,pageCode) {
          var vm = this;
          console.log(this.listQuery.activityRange);

          if (this.listQuery.activityRange == '') {
              vm.getTotalPage();
              vm.getTableData();
          } else {
            vm.countFilterRange();
            var selectRange = {};
            selectRange.range = vm.listQuery.activityRange;
            selectRange.limit=vm.pageInfo.pageSize;
            selectRange.page=vm.pageInfo.pageCode-1;
            $.ajax({
              url: "http://10.112.17.185:8100/api/v1/info/entranceWorkByRange",
              type: "GET",
              contentType: "application/json",
              dataType: "JSON",
              data: selectRange,
              success: function (msg) {
                console.log("筛选成功" + msg);

                // vm.pageInfo.totalPage = msg.length;
                // vm.pageInfo.pageCode = 1;
                vm.tableData = msg;
              },
              error: function (err) {
                console.log("筛选失败")
              }
            })
          }
        },
        countFilterRange(){
          var vm=this;
          var filteredData={};
          filteredData.range=this.listQuery.activityRange
          $.ajax({
            url:"http://10.112.17.185:8100/api/v1/info/workCountByRange",
            type:"GET",
            dataType:"JSON",
            data:filteredData,
            success:function (msg) {
              console.log("筛选后信息总条数获取成功： "+msg+"条记录")
              vm.pageInfo.totalPage=msg;
            },
            error:function (err) {
              alert("信息总条数获取失败");
            }
          })
        },
        filterRange(value,row){

          return row.activity_range===value;

        },
        handleEdit(row) {
          var vm=this;
          const index=this.tableData.indexOf(row);
          this.transID=this.tableData[index].id;
          var dataEdit={}
          dataEdit.entranceId=this.transID;
          console.log(dataEdit);
          $.ajax({
            url:"http://10.112.17.185:8100/api/v1/info/entranceWorkById",
            type:"GET",
            contentType:"application/json",
            dataType:"JSON",
            data:dataEdit,
            success:function (msg) {
              vm.form.id=msg.id;
              vm.form.duration=msg.duration;
              vm.form.date=msg.date;
              vm.form.work_number=msg.work_number;
              vm.form.activity_range=msg.activity_range;
              vm.form.evaluation=msg.evaluation;
              vm.dialogEditVisible=true;
              console.log("查看编辑信息成功："+msg);
            },
            error:function (err) {
              alert("编辑信息获取失败")
            }
          })
        },
        handleEditConfirm(){
          var vm=this;
          console.log(this.form);
          var editForm=JSON.stringify(this.form);
          $.ajax({
            url:"http://10.112.17.185:8100/api/v1/info/entranceWork",
            type:"PUT",
            contentType:"application/json",
            dataType:"JSON",
            data:editForm,
            success:function () {
              vm.dialogEditVisible=false;
              vm.getTableData();
              vm.resetForm();
              console.log("编辑信息确认发送")
            },
            error:function (err) {
              alert("编辑信息发送失败")
            }
          })


        },
        handleCheck(row){
          var vm=this;
          const index = this.tableData.indexOf(row);
          this.transID=this.tableData[index].id;
          var dataGet={};
          dataGet.entranceId=this.transID;
          console.log(dataGet)
          $.ajax({
            url:"http://10.112.17.185:8100/api/v1/info/entranceWorkById",
            type:"GET",
            contentType:"application/json",
            dataType:"JSON",
            data:dataGet,
            success:function (msg) {
              vm.form.id=msg.id;
              vm.form.duration=msg.duration;
              vm.form.date=msg.date;
              vm.form.work_number=msg.work_number;
              vm.form.activity_range=msg.activity_range;
              vm.form.evaluation=msg.evaluation;
              vm.dialogCheckVisible=true;
              console.log("查看信息成功"+msg);
            },
            error:function (err) {
              alert("查看信息失败")
            }
          })

        },
        handleCheckConfirm(){
          this.dialogCheckVisible=false
        },
        handleDelete(row) {
          var vm=this;
          this.dialogDeleteVisible=true
          const index=this.tableData.indexOf(row)
          var currRow=index+1;
          this.transID=this.tableData[currRow-1].id;

          console.log(this.transID)
        },
        handleDeleteConfirm(){
          var vm=this;
          var dataDelete={}
          dataDelete.WorkId=this.transID;
          console.log(dataDelete)
          $.ajax({
            url:"http://10.112.17.185:8100/api/v1/info/entranceWorkById?WorkId="+dataDelete.WorkId,
            type:"DELETE",
            contentType:"application/json",
            dataType:"text",
            success:function () {
              vm.dialogDeleteVisible=false;
              vm.getTableData();
              vm.getTotalPage();
              console.log("删除成功")
            },
            error:function (err) {
              alert("删除失败")
            }

          })
        },
        handleEvaluate(row){
          var vm=this;
          const index=this.tableData.indexOf(row)
          this.transID=this.tableData[index].id;
          var dataEvaluate={};
          dataEvaluate.entranceId=this.transID;
          console.log(dataEvaluate)
          $.ajax({
            url:"http://10.112.17.185:8100/api/v1/info/entranceWorkById",
            type:"GET",
            contentType:"application/json",
            dataType:"JSON",
            data:dataEvaluate,
            success:function (msg) {
              vm.form.id=msg.id;
              vm.form.evaluation=msg.evaluation;
              vm.dialogEvaluateVisible=true;
              console.log("查看评价信息成功"+msg);
            },
            error:function (err) {
              alert("查看评价信息失败")
            }
          })
        },
        handleEvaluateConfirm(){
          var vm=this;
          var dataEvaluate={}
          dataEvaluate.id=this.form.id;
          dataEvaluate.evaluation=this.form.evaluation;
          var dataEvaluateString=JSON.stringify(dataEvaluate);
          console.log(dataEvaluate);
          $.ajax({
            url:"http://10.112.17.185:8100/api/v1/info/entranceWorkEvaluation",
            type:"PUT",
            contentType:"application/json;charset=utf-8",
            dataType:"text",
            data:dataEvaluateString,
            success:function(){
              vm.dialogEvaluateVisible=false;
              vm.getTableData();
              vm.resetForm()
              console.log("评价信息发送成功")
            },
            error:function (err) {
              alert("评价信息发送失败")
            }
          })
        },
        //pageSize改变时触发
        handleSizeChange(val){
          this.pageInfo.pageSize=val;
          if(this.listQuery.activityRange=='') {
            this.getTableData(this.pageInfo.pageSize, this.pageInfo.pageCode);
          }else{
            this.handleFilterRange(this.listQuery.activityRange,this.pageInfo.pageSize,this.pageInfo.pageCode)
          }
        },
        //当前页改变时触发
        handleCurrentChange(val){
          this.pageInfo.pageCode=val;
          if(this.listQuery.activityRange=='') {
            this.getTableData(this.pageInfo.pageSize, this.pageInfo.pageCode);
          }else{
            this.handleFilterRange(this.listQuery.activityRange,this.pageInfo.pageSize,this.pageInfo.pageCode);
          }
        }

      }

    }


</script>

<style>
  .pagination-container{
    background: #fff;
    padding: 32px 16px;
  }
  </style>
