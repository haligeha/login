<template>
  <div class="goods">
    <div id="page-wrapper">
      <div class="header">
        <h1 class="page-header">
          应急救援物资
        </h1>
        <ol class="breadcrumb">
          <li><a href="/hello">主页</a></li>
          <li><a href="#">救援物资</a></li>
          <li class="active">数据</li>
        </ol>

      </div>
      <div>
        <el-button size="mini" style="margin-left: 20px" @click="resetForm(),dialogAddVisible=true">添加</el-button>
      </div>

      <div class="pageBody">
        <el-table
          :data="tableDataSup"
          @expand-change="expandChange"
          style="width: 98%;left:20px;">
          <el-table-column type="expand">
            <template slot-scope="scope">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="序号">
                  <span>{{ scope.row.supply_id }}</span>
                </el-form-item>
                <el-form-item label="物资名称">
                  <span>{{ scope.row.name }}</span>
                </el-form-item>
                <el-form-item label="物资类别">
                  <span>{{ scope.row.category }}</span>
                </el-form-item>
                <el-form-item label="物资数量">
                  <span>{{ scope.row.quantity }}</span>
                </el-form-item>
                <el-form-item label="物资型号">
                  <span>{{ scope.row.model }}</span>
                </el-form-item>
                <el-form-item label="生产厂家">
                  <span>{{ scope.row.manufacturer }}</span>
                </el-form-item>
                <el-form-item label="购入日期">
                  <span>{{ scope.row.purchase_date|formatDate }}</span>
                </el-form-item>
                <el-form-item label="出厂日期">
                <span>{{ scope.row.manufacture_date|formatDate }}</span>
              </el-form-item>
                <el-form-item label="有效期至">
                  <span>{{ scope.row.valid_until|formatDate }}</span>
                </el-form-item>
                <el-form-item label="所属单位/部门">
                  <span>{{ scope.row.affiliation }}</span>
                </el-form-item>
                <el-form-item label="存放地点">
                  <span>{{ scope.row.location }}</span>
                </el-form-item>
                <el-form-item label="性能说明">
                  <span>{{ scope.row.performance_description }}</span>
                </el-form-item>
                <el-col :span="25">
                <el-form-item label="用途说明">
                  <span>{{ scope.row.use_description }}</span>
                </el-form-item>
                </el-col>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column label="序号" prop="supply_id" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.supply_id}}</span>
            </template>
          </el-table-column>
          <el-table-column label="物资名称" prop="name" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.name}}</span>
            </template>
          </el-table-column>
          <el-table-column label="物资类别" prop="category" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.category}}</span>
            </template>
          </el-table-column>
          <el-table-column label="物资数量" prop="quantity" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.quantity}}</span>
            </template>
        </el-table-column>
          <el-table-column label="物资型号" prop="model" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.model}}</span>
            </template>
          </el-table-column>
          <el-table-column label="存放地点" prop="location" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.location}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="300">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="handleEditSup(scope.row)">编辑</el-button>
              <el-button type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
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
            <el-form-item label="物资名称":label-width="formLabelWidth">
              <el-input v-model="form.name" prop="name"></el-input>
            </el-form-item>
              </el-col>
              <el-col :span="10">
            <el-form-item label="物资类别":label-width="formLabelWidth">
              <el-input v-model="form.category" prop="category"></el-input>
            </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="5">
              <el-col :span="10">
            <el-form-item label="物资数量":label-width="formLabelWidth">
              <el-input v-model="form.quantity" prop="quantity"></el-input>
            </el-form-item>
              </el-col>
              <el-col :span="10">
            <el-form-item label="物资型号":label-width="formLabelWidth">
              <el-input v-model="form.model" prop="model"></el-input>
            </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="生产厂家":label-width="formLabelWidth">
              <el-col :span="8">
              <el-input v-model="form.manufacturer" prop="manufacturer"></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="购买日期":label-width="formLabelWidth">
              <el-date-picker v-model="form.purchase_date" type="datetime" placeholder="请选择日期时间" value-format="timestamp">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="出厂日期":label-width="formLabelWidth">
              <el-date-picker v-model="form.manufacture_date" type="datetime" placeholder="请选择日期时间" value-format="timestamp">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="有效期至":label-width="formLabelWidth">
              <el-date-picker v-model="form.valid_until" type="datetime" placeholder="请选择日期时间" value-format="timestamp">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="用途说明":label-width="formLabelWidth">
              <el-input v-model="form.use_description" type="textarea" prop="use_description"></el-input>
            </el-form-item>
            <el-form-item label="性能说明":label-width="formLabelWidth">
              <el-input v-model="form.performance_description" type="textarea" prop="performance_description"></el-input>
            </el-form-item>
            <el-form-item label="所属单位":label-width="formLabelWidth">
              <el-input v-model="form.affiliation" prop="affiliation"></el-input>
            </el-form-item>
            <el-form-item label="存放地点":label-width="formLabelWidth">
              <el-input v-model="form.location" prop="location"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="resetForm,dialogAddVisible=false">取消</el-button>
            <el-button type="primary" @click="handleAddSup">确定</el-button>
          </div>
        </el-dialog>

        <el-dialog title="编辑信息":visible.sync="dialogEditVisible">
          <el-form>
            <el-row :gutter="5">
              <el-col :span="10">
            <el-form-item label="序号":label-width="formLabelWidth">
              <el-input v-model="form.supply_id" prop="supply_id" disabled=""></el-input>
            </el-form-item>
              </el-col>
              <el-col :span="10">
            <el-form-item label="物资名称":label-width="formLabelWidth">
              <el-input v-model="form.name" prop="name" disabled=""></el-input>
            </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="5">
              <el-col :span="10">
            <el-form-item label="物资类别":label-width="formLabelWidth">
              <el-input v-model="form.category" prop="category"></el-input>
            </el-form-item>
              </el-col>
              <el-col :span="10">
            <el-form-item label="物资数量":label-width="formLabelWidth">
              <el-input v-model="form.quantity" prop="quantity"></el-input>
            </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="5">
              <el-col :span="10">
            <el-form-item label="物资型号":label-width="formLabelWidth">
              <el-input v-model="form.model" prop="model"></el-input>
            </el-form-item>
              </el-col>
              <el-col :span="10">
            <el-form-item label="生产厂家":label-width="formLabelWidth">
              <el-input v-model="form.manufacturer" prop="manufacturer"></el-input>
            </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="购买日期":label-width="formLabelWidth">
              <el-date-picker v-model="form.purchase_date" type="datetime" placeholder="请选择日期时间" value-format="timestamp">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="出厂日期":label-width="formLabelWidth">
              <el-date-picker v-model="form.manufacture_date" type="datetime" placeholder="请选择日期时间" value-format="timestamp">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="有效期至":label-width="formLabelWidth">
              <el-date-picker v-model="form.valid_until" type="datetime" placeholder="请选择日期时间" value-format="timestamp">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="用途说明":label-width="formLabelWidth">
              <el-input v-model="form.use_description" type="textarea" prop="use_description"></el-input>
            </el-form-item>
            <el-form-item label="性能说明":label-width="formLabelWidth">
              <el-input v-model="form.performance_description" type="textarea" prop="performance_description"></el-input>
            </el-form-item>
            <el-form-item label="所属单位":label-width="formLabelWidth">
              <el-input v-model="form.affiliation" prop="affiliation"></el-input>
            </el-form-item>
            <el-form-item label="存放地点":label-width="formLabelWidth">
              <el-input v-model="form.location" prop="location"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="resetForm(),dialogEditVisible=false">取消</el-button>
            <el-button type="primary" @click="handleEditSupConfirm()">确定</el-button>
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
        tableDataSup:[],
        dialogAddVisible:false,
        dialogEditVisible:false,
        dialogDeleteVisible:false,
        formLabelWidth:"100px",
        transID:undefined,
        form:{
          supply_id:undefined,
          name:'',
          category:'',
          quantity:'',
          model:'',
          purchase_date:'',
          manufacturer:'',
          manufacture_date:'',
          valid_until:'',
          use_description:'',
          performance_description:'',
          affiliation:'',
          location:''
        },
        pageInfo:{
          pageCode:1,  //当前页
          pageOption:[3,5,10,20,50,100],   //分页选项
          pageSize:10,   //每页显示记录数
          totalPage:100   //总记录数
        },
      }
    },
    created:function(){
      this.getTotalPage()
      this.getTableDataSup()

    },
    methods:{
      getTableDataSup(pageSize,pageCode){
        var vm=this;
        var pageData={}
        pageData.limit=vm.pageInfo.pageSize;
        pageData.page=vm.pageInfo.pageCode-1;
        $.ajax({
          type:"GET",
          dataType:"JSON",
          url:"http://10.112.17.185:8100/api/v1/info/suppliesByPage",
          contentType:"application/json;charset=utf-8",
          data:pageData,
          success:function (msg) {
            console.log("信息获取成功")
            console.log(msg)
            vm.tableDataSup=msg;
          },
          error:function (err) {
            console.log(err)
            alert("信息获取失败");
          }
        })
      },
      getTotalPage(){
        var vm=this;
        $.ajax({
          url:"http://10.112.17.185:8100/api/v1/info/suppliesCount",
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
      //pageSize改变时触发
      handleSizeChange(val){
        this.pageInfo.pageSize=val;
        this.getTableDataSup(this.pageInfo.pageSize,this.pageInfo.pageCode);
      },
      //当前页改变时触发
      handleCurrentChange(val){
        this.pageInfo.pageCode=val;
        this.getTableDataSup(this.pageInfo.pageSize,this.pageInfo.pageCode);
      },
      expandChange(row,expandedRows){
        if (expandedRows.length>1){
          expandedRows.shift();
        }
      },
      resetForm(){
         this.form={
           supply_id:undefined,
           name:'',
           category:'',
           quantity:'',
           model:'',
           purchase_date:'',
           manufacturer:'',
           manufacture_date:'',
           valid_until:'',
           use_description:'',
           performance_description:'',
           affiliation:'',
           location:''
         }
      },
      handleAddSup(){
        var vm=this;
        var dataAdd={};
        dataAdd.name=this.form.name;
        dataAdd.category=this.form.category;
        dataAdd.quantity=this.form.quantity;
        dataAdd.model=this.form.model;
        dataAdd.purchase_date=this.form.purchase_date;
        dataAdd.manufacturer=this.form.manufacturer;
        dataAdd.manufacture_date=this.form.manufacture_date;
        dataAdd.valid_until=this.form.valid_until;
        dataAdd.use_description=this.form.use_description;
        dataAdd.performance_description=this.form.performance_description;
        dataAdd.affiliation=this.form.affiliation;
        dataAdd.location=this.form.location;
        var dataAddString=JSON.stringify(dataAdd);
        $.ajax({
          url:"http://10.112.17.185:8100/api/v1/info/supplies",
          type:"POST",
          contentType:"application/json;charset=utf-8",
          dataType:"JSON",
          data:dataAddString,
          success:function () {
            console.log("添加信息发送成功");
            vm.getTotalPage();
            vm.getTableDataSup();
            vm.dialogAddVisible=false;
            vm.resetForm();
          },
          error:function (err) {
            alert("添加信息发送失败")
          }

        })
      },
      handleEditSup(row){
        var vm=this;
        const index=this.tableDataSup.indexOf(row);
        this.transID=this.tableDataSup[index].supply_id;
        var dataEdit={};
        dataEdit.supplyId=this.transID;
        $.ajax({
          url:"http://10.112.17.185:8100/api/v1/info/supplies",
          type:"GET",
          contentType:"application/json",
          dataType:"JSON",
          data:dataEdit,
          success:function(msg){
            console.log("编辑信息获取成功："+msg);
            vm.dialogEditVisible=true;
            vm.form=msg;
          },error:function (err) {
            alert("编辑信息获取失败")
          }
        })
        },
      handleEditSupConfirm(){
        var vm=this;
        console.log(this.form)
        var editForm=JSON.stringify(this.form);
        $.ajax({
          url:"http://10.112.17.185:8100/api/v1/info/supplies",
          type:"PUT",
          dataType:"JSON",
          contentType:"application/json",
          data:editForm,
          success:function () {
            console.log("编辑信息确认发送")
            vm.dialogEditVisible=false;
            vm.getTableDataSup();
            vm.resetForm()
          },
          error:function (err) {
            alert("编辑信息发送失败")
          }
        })
      },
      handleDelete(row){
        this.dialogDeleteVisible=true;
        const index=this.tableDataSup.indexOf(row);
        this.transID=this.tableDataSup[index].supply_id;
        console.log(this.transID);
      },
      handleDeleteConfirm(){
        var vm=this;
        var dataDelete={}
        dataDelete.id=this.transID;
        $.ajax({
          url:"http://10.112.17.185:8100/api/v1/info/supplies?id="+dataDelete.id,
          type:"DELETE",
          contentType:"application/json",
          dataType:"text",
          success:function () {
            vm.dialogDeleteVisible=false;
            vm.getTableDataSup()
            vm.getTotalPage()
            console.log("删除成功")
          },
          error: function (err) {
            alert("删除失败")

          }
        })
      }

    }
  }
</script>


<style>
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 120px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width:50%;
  }
</style>
