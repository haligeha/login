<template>
    <div class="charts">
      <div id="page-wrapper" >
        <div class="header">
          <h1 class="page-header">
            巡检日历
          </h1>
          <ol class="breadcrumb">
            <li><router-link to="/calendar"> <a href="#">主页</a></router-link></li>
            <li><a href="#">巡检计划</a></li>
            <li class="active">数据</li>
          </ol>
        </div>
        <div class="container">
          <!-- <div class="container">-->
          <div id="calendar">
            <!-- 年份 月份 -->
            <div class="month">
                <ul>
                <!--点击会触发pickpre函数，重新刷新当前日期 @click(vue v-on:click缩写) -->
                <li class="arr" @click="pickPre(currentYear,currentMonth)">❮</li>
                <li class="year-month" @click="pickYear(currentYear,currentMonth)">
                  <span class="choose-year">{{ currentYear }}年{{ currentMonth }}月</span>
                  <!--    <span class="choose-month">{{ currentMonth }}月</span>-->
                </li>
                <li class="arr" @click="pickNext(currentYear,currentMonth)">❯</li>
              </ul>
            </div>
            <!-- 星期 -->
            <ul class="weekdays">
              <li>一</li>
              <li>二</li>
              <li>三</li>
              <li>四</li>
              <li>五</li>
              <li>六</li>
              <li>日</li>
            </ul>
            <!-- 日期 -->
            <ul class="days">
              <!-- 核心 v-for循环 每一次循环用<li>标签创建一天 -->
              <li v-for="dayobject in days">
                <!--本月-->
                <!--如果不是本月  改变类名加灰色-->

                <div v-if="dayobject.day.getMonth()+1 != currentMonth" class="other-month">{{ dayobject.day.getDate() }}</div>

                <!--如果是本月  还需要判断是不是这一天-->
                <div v-else>
                  <!--今天  同年同月同日-->
                  <!--  <div v-if=" dayobject.eventSign.flag===true" class="active" :class="{error:dayobject.eventSign[0].arrList.error}" @click="showDetail(dayobject)">-->
                  <div v-if="dayobject.eventSign.length>0" class="active" @click="getTotalPage(GMTToStr(dayobject.day)),showDetail(dayobject)">
                    {{ dayobject.day.getDate() }}
                  </div>


                  <div v-else class="normal" @click="show(dayobject)">{{ dayobject.day.getDate() }}</div>
                </div>

              </li>
            </ul>
          </div>

          <!--Detail-->
          <div class="showEvent">
            <div class="title">巡检情况</div>
            <div class="item" v-for="event in items">
              序号:{{event.id}}<br>
              值班人姓名：{{event.duty_person}}<br>
              巡检人员姓名：{{event.inspection_person}}<br>
              巡检日期： {{Timestamp(event.calendar_date)}}<br>

              <div class="buttonstyle">
                <el-button
                  size="mini"
                  @click="handleEdit(event.id)">编辑</el-button>
                <el-button
                  size="mini"
                  @click="handleCheck(event.id)">详情</el-button>
                <el-button
                  size="mini"
                  type="danger"
                  @click="handleDelete(event.id)">删除</el-button>
              </div>

            </div>

            <!--Detail pagination-->
            <div class="pagination-container" align="right" style="margin-left:20px;margin-right: 4px">
              <el-pagination
                @current-change="handleCurrentChange"
                :current-page.sync="pageInfo.pageCode"
                :page-size="pageInfo.pageSize"
                layout=" prev, pager, next"
                :total="pageInfo.totalPage">
              </el-pagination>
            </div>
          </div>

          <!--添加新信息-->
          <el-dialog title="添加信息":visible.sync="dialogAddVisible">
            <el-form ref="form" :rules="rules" :model="form">
              <el-form-item label="值班人":label-width="formLabelWidth" prop="duty_person">
                <el-input v-model="form.duty_person" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="巡检人员":label-width="formLabelWidth" prop="inspection_person">
                <el-input v-model="form.inspection_person"autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="巡检总况" :label-width="formLabelWidth" prop="state">
                <el-input v-model="form.state" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="巡检内容总结" :label-width="formLabelWidth" prop="summary">
                <el-input v-model="form.summary" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="异常项" :label-width="formLabelWidth" prop="abnormal">
                <el-input v-model="form.abnormal" autocomplete="off" ></el-input>
              </el-form-item>
              <el-form-item label="维护信息" :label-width="formLabelWidth" prop="maintenance">
                <el-input v-model="form.maintenance" autocomplete="off"></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogAddVisible=false">取消</el-button>
              <el-button type="primary" @click="handleAddForm('form',dayobject)">确定</el-button>
            </div>
          </el-dialog>

          <!--Edit-->
          <el-dialog title="编辑信息":visible.sync="dialogEditVisible">
            <el-form>
              <el-form-item label="序号":label-width="formLabelWidth">
                <el-input v-model="form.id" :disabled="true"></el-input>
              </el-form-item>
              <el-form-item label="值班人":label-width="formLabelWidth">
                <el-input v-model="form.duty_person" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="巡检人员":label-width="formLabelWidth">
                <el-input v-model="form.inspection_person"autocomplete="off" ></el-input>
              </el-form-item>
              <el-form-item label="创建日期":label-width="formLabelWidth" disable="true">
                <el-input v-model="form.create_date"  :disabled="true" autocomplete="off">
                </el-input>
              </el-form-item>
              <el-form-item label="巡检时间":label-width="formLabelWidth">
                <el-input v-model="form.calendar_date" autocomplete="off" ></el-input>
              </el-form-item>
              <el-form-item label="巡检总况":label-width="formLabelWidth">
                <el-input v-model="form.state" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="巡检内容总结":label-width="formLabelWidth">
                <el-input v-model="form.summary" autocomplete="off" ></el-input>
              </el-form-item>
              <el-form-item label="异常项":label-width="formLabelWidth">
                <el-input v-model="form.abnormal" autocomplete="off" ></el-input>
              </el-form-item>
              <el-form-item label="维护信息":label-width="formLabelWidth">
                <el-input v-model="form.maintenance" autocomplete="off" ></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogEditVisible=false">取消</el-button>
              <el-button type="primary" @click="handleEditConfirm()">确定</el-button>
            </div>
          </el-dialog>

          <!--详情-->
          <el-dialog title="详细信息":visible.sync="dialogCheckVisible">
            <el-form>
              <el-form-item label="序号":label-width="formLabelWidth">
                <el-input v-model="form.id" :disabled="true"></el-input>
              </el-form-item>
              <el-form-item label="值班人":label-width="formLabelWidth">
                <el-input v-model="form.duty_person" autocomplete="off" :disabled="true"></el-input>
              </el-form-item>
              <el-form-item label="巡检人员":label-width="formLabelWidth">
                <el-input v-model="form.inspection_person"autocomplete="off" :disabled="true" ></el-input>
              </el-form-item>
              <el-form-item label="创建日期":label-width="formLabelWidth">
                <el-input v-model="form.create_date" autocomplete="off" :disabled="true">
                </el-input>
              </el-form-item>
              <el-form-item label="巡检时间":label-width="formLabelWidth">
                <el-input v-model="form.calendar_date" autocomplete="off" :disabled="true"></el-input>
              </el-form-item>
              <el-form-item label="巡检总况":label-width="formLabelWidth">
                <el-input v-model="form.state" autocomplete="off" :disabled="true"></el-input>
              </el-form-item>
              <el-form-item label="巡检内容总结":label-width="formLabelWidth">
                <el-input v-model="form.summary" autocomplete="off" :disabled="true"></el-input>
              </el-form-item>
              <el-form-item label="异常项":label-width="formLabelWidth">
                <el-input v-model="form.abnormal" autocomplete="off" :disabled="true"></el-input>
              </el-form-item>
              <el-form-item label="维护信息":label-width="formLabelWidth">
                <el-input v-model="form.maintenance" autocomplete="off" :disabled="true"></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogCheckVisible=false">取消</el-button>
              <el-button type="primary" @click="handleCheckConfirm()">确定</el-button>
            </div>
          </el-dialog>

          <!--Delete-->
          <el-dialog title="提示" :visible.sync="dialogDeleteVisible" width="30%">
            <span>确认删除这条记录？</span>
            <span slot="footer" class="dialog-footer">
        <el-button @click="dialogDeleteVisible=false">取消</el-button>
        <el-button type="primary" @click="handleDeleteConfirm()">确定</el-button>
      </span>
          </el-dialog>

          <!-- Add button-->
          <i class="el-icon-circle-plus" @click="addEvent()"></i>
        </div>
      </div>
    </div>



</template>

<script>
    export default {
      data() {
        return {
          rules:{
            duty_person:[{required:true,message:'负责人不能为空'}],
            inspection_person:[{required:true,message:"巡检人员不能为空"}],
          },
          dialogAddVisible: false,
          dialogDeleteVisible:false,
          dialogCheckVisible:false,
          dialogEditVisible:false,
          transID:undefined,
          calendar_date:'',
          click_date:'',
          calendarDate:'',
          calendar:'',
          tempArr: [],
          dayobject:{},
          currentDay: 1,
          currentMonth: 1,
          currentYear: 1970,
          currentWeek: 1,
          days: [],
          items: [],
          arrDate: [10, 15],
          isShow: false,
          pageInfo:{
            pageCode:1,
            pageSize:2,
            totalPage:3
          },
          form: {
            id: undefined,
            duty_person: '',
            inspection_person: '',
            create_date: '',
            calendar_date: '',
            state:'',
            summary: '',
            abnormal: '',
            maintenance: ''
          },

          formLabelWidth: "100px",
        };


      },

      created: function () { // 在vue初始化时调用//
        this.getTempArr();
      },

      methods: {
        //格林威治转年月日
        GMTToStr: function (time) {
          let date = new Date(time)
          let Str = date.getFullYear() + '-' +
            (date.getMonth() + 1) + '-' +
            date.getDate()
          return Str
        },

        //时间戳转年月日时分秒
        Hour:function (create_date){
          var date= new Date(create_date*1000);
          var Y = date.getFullYear() + '-';
          var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
          var D = date.getDate()+' ';
          var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
          var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) ;
          return Y + M + D+h+m;
    },

        //时间戳转年月日
        Timestamp:function(create_date){
            var date = new Date(create_date * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
            var Y = date.getFullYear() + '-';
            var M= (date.getMonth()+1)+ '-';
            var D = date.getDate();
            return Y + M + D
        },

        //绿色角标的渲染获取
        getTempArr: function () {
          var vm = this;
          $.ajax({
            type: "GET",
            dataType: "JSON",
            //  header:"Access-Control-Allow-Origin:  http://10.112.17.185:8100",
            url: "/api/v1/info/allReport",
            success: function (msg) {
              vm.tempArr=msg;
              vm.initData(null);
            },
            error: function (err) {
              console.log("加载失败");
            }
          });

        },

        //获取所有事件信息
        initData: function (cur) {
          //    var leftcount = 0

          var date
          if (cur) {

            date = new Date(cur)
          } else {
            var now = new Date()
            if(now.getMonth()===0){
              var d = new Date(this.formatDate(now.getFullYear()-1, 12, 1))
              d.setDate(42)
              date = new Date(this.formatDate(d.getFullYear(), d.getMonth() + 1, 1))
            }
            else{
              var d = new Date(this.formatDate(now.getFullYear(), now.getMonth(), 1))

              d.setDate(42)
              date = new Date(this.formatDate(d.getFullYear(), d.getMonth()+1, 1))
            }
          }

          this.currentDay = date.getDate()

          this.currentYear = date.getFullYear()

          this.currentMonth = date.getMonth() + 1

          this.currentWeek = date.getDay() // 1...6,0

          if (this.currentWeek === 0) {
            this.currentWeek = 7
          }
          var str = this.formatDate(this.currentYear, this.currentMonth, this.currentDay)
          this.days.length = 0
          // 今天是周日，放在第一行第7个位置，前面6个
          // 初始化本周
          for (var i = this.currentWeek - 1; i >= 0; i--) {
            var d = new Date(str)
            d.setDate(d.getDate() - i)
            var dayobject = {}// 用一个对象包装Date对象  以便为以后预定功能添加属性
            dayobject.day = d
            var tempTime = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate()
            var tempSign = this.isVerDate(tempTime)

            dayobject.eventSign = tempSign

            var maxy = [];
            var ma = [];
            if (tempSign.length > 0) {

              for (var m = 0; m < tempSign.length; m++) {

                ma = tempSign[m];
                maxy.push(ma);

              }
              dayobject = {day: d, eventSign: maxy}

              this.days.push(dayobject)
            }
            else {
              dayobject = {day: d, eventSign: []}
              this.days.push(dayobject)
            }

          }
          // 其他周
          for (var i = 1; i <= 42 - this.currentWeek; i++) {
            var d = new Date(str)
            d.setDate(d.getDate() + i)

            var dayobject = {}
            var tempTime = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate()
            var tempSign = this.isVerDate(tempTime)

            var maxy = [];
            var ma = [];
            if (tempSign.length > 0) {

              for (var m = 0; m < tempSign.length; m++) {

                ma = tempSign[m];
                maxy.push(ma);

              }
              dayobject = {day: d, eventSign: maxy}

              this.days.push(dayobject)
            }
            else {
              dayobject = {day: d, eventSign: []}
              this.days.push(dayobject)

            }


          }
        },
        isVerDate(v) {
          var vm=this;
          var tem = new Array();
          var temp = '';
          for (var i = 0; i < this.tempArr.length; i++) {
            if ( vm.Timestamp(this.tempArr[i].calendar_date) === v) {
              temp = {flag: true, arrList: this.tempArr[i]}
              tem.push(temp)
            } else {
              temp = {flag: false, arrList: ''}
            }
            ;
          }

          return tem;
        },

        //前翻
        pickPre: function (year, month) {
          var d = new Date(this.formatDate(year, month, 1))
          d.setDate(0)
          this.initData(this.formatDate(d.getFullYear(), d.getMonth() + 1, 1))
        },

        //后翻
        pickNext: function (year, month) {
          var d = new Date(this.formatDate(year, month, 1))
          d.setDate(42)
          this.initData(this.formatDate(d.getFullYear(), d.getMonth() + 1, 1))
        },

        //当前年月
        pickYear: function (year, month) {
          this.$message(year + ',' + month);
        },

        // 返回 类似 2016-01-02 格式的字符串
        formatDate: function (year, month, day) {
          var y = year
          var m = month
          if (m < 10) m = '0' + m
          var d = day
          if (d < 10) d = '0' + d
          return y + '-' + m + '-' + d
        },

        //获取用户点击的日期后传递给addEvent(无事件)
        show:function(dayobject){
          var vm=this;
          vm.click_date=vm.GMTToStr(dayobject.day)
        },

        //展示事件并获取用户点击的日期后传递给addEvent(已有事件)
        showDetail:function(dayobject){
          var vm=this;
          vm.click_date=vm.GMTToStr(dayobject.day)
          this.items=[];
          vm.calendar_date=vm.GMTToStr(dayobject.day);
          vm.calendarDate=vm.GMTToStr(dayobject.day);
          vm.calendar_date=Math.round(new Date(vm.calendar_date).getTime()/1000).toString();

          var dataCheck={}
          dataCheck.calendar_date=vm.calendar_date;
          dataCheck.limit=vm.pageInfo.pageSize;
          dataCheck.page=vm.pageInfo.pageCode-1;

          $.ajax({
              url:"/api/v1/info/inspectionByCalendarDate",
              type:"GET",
              //   contentType:"application/json",
              dataType:"JSON",
              data:dataCheck,
              success:function (msg) {
                vm.items=msg;

                console.log("查看信息成功")

              },
              error:function (err) {
                console.log("加载添加失败")
              }
            })
          },

        //  用大按钮 添加新的event
        addEvent:function(){
          var vm=this
          if(vm.click_date == ''||vm.click_date==null){
            this.$message({
              type: 'info',
              message: "请选择日期后添加"
            });
          }
          else{
            vm.dialogAddVisible=true;
            this.$message({
              type: 'info',
              message: "已选择"+vm.click_date
            });

          }

        },

        // 验证表单的有效性
        handleAddForm:function(formName,dayobject){
          var vm=this;

          this.$refs[formName].validate((valid) => {
            if (valid) {
              vm.handleAdd(dayobject)
            } else {
              return false;
            }
          });
        },

        // 添加新信息
        handleAdd(dayobject) {
          var vm = this
          this.form.create_date = Math.round(new Date().getTime()/1000).toString();
          vm.click_date = Math.round(new Date(vm.click_date).getTime()/1000).toString();
          vm.form.calendar_date=vm.click_date;

          var dataPost = {};
          dataPost.duty_person = this.form.duty_person;
          dataPost.inspection_person = this.form.inspection_person;
          dataPost.create_date = this.form.create_date;
          dataPost.calendar_date = this.form.calendar_date;
          dataPost.state = this.form.state;
          dataPost.summary = this.form.summary;
          dataPost.abnormal = this.form.abnormal;
          dataPost.maintenance = this.form.maintenance;

          var dataPostString = JSON.stringify(dataPost);
          $.ajax({
            url: "/api/v1/info/inspection",
            type: "POST",
            contentType: "application/json;charset=utf-8",
            dataType: "text",
            data: dataPostString,
            success: function (msg) {
              vm.dialogAddVisible = false;
              vm.resetForm();
              vm.getTempArr();
            },
            error: function (err) {
              console.log("加载添加失败")
            }
          })

        },

        //详细信息的分页
        handleCurrentChange:function(val){
          var vm=this

          this.pageInfo.pageCode=val;
          var calendar=vm.calendarDate
          alert(vm.calendarDate)
          this.showDetail(calendar,this.pageInfo.pageSize,this.pageInfo.pageCode);
        },

        //详情信息的总页数
        getTotalPage(date){
          var vm=this;
          vm.calendar_date=date
          vm.calendar_date=Math.round(new Date(vm.calendar_date).getTime()/1000).toString();
          var dataPass={}
          dataPass.date=vm.calendar_date;
          $.ajax({
            url:"/api/v1/info/inspectionOfDay",
            type:"GET",
            dataType:"JSON",
            data:dataPass,
            success:function (msg) {
              console.log("信息总条数获取成功： "+msg+"条记录")
              vm.pageInfo.totalPage=msg;
            },
            error:function (err) {
              console.log("信息总条数获取失败");
            }
          })

        },

        //编辑日历
        handleEdit(id) {
          var vm=this;
          this.transID=id;
          var dataEdit={}
          dataEdit.reportId=this.transID;

          $.ajax({
            url:"/api/v1/info/inspectionById",
            type:"GET",
            //   contentType:"application/json",
            dataType:"JSON",
            data:dataEdit,
            success:function (msg) {
              vm.form.id=msg.id;
              vm.form.duty_person=msg.duty_person;
              vm.form.inspection_person=msg.inspection_person;
              vm.form.create_date=vm.Hour(msg.create_date);
              vm.form.calendar_date=vm.Timestamp(msg.calendar_date);
              vm.form.state=msg.state;
              vm.form.summary=msg.summary;
              vm.form.abnormal=msg.abnormal;
              vm.form.maintenance=msg.maintenance;
              vm.dialogEditVisible=true;
              console.log("查看编辑信息成功")
            },
            error:function (err) {
              console.log("加载编辑失败")
            }
          })
        },
        handleEditConfirm(){
          var vm=this;
          var mx=new Date(this.form.calendar_date)
          this.form.calendar_date = Math.round(new Date(mx).getTime()/1000).toString();
          this.calendar=vm.Timestamp(this.form.calendar_date);
          this.form.create_date = Math.round(new Date(this.form.create_date).getTime()/1000).toString();

          var dataDate=new Date(this.calendar);
          var dataPost = {};
          dataPost.id = this.form.id;
          dataPost.duty_person = this.form.duty_person;
          dataPost.inspection_person = this.form.inspection_person;
          dataPost.create_date = this.form.create_date;
          dataPost.calendar_date = this.form.calendar_date;
          dataPost.state = this.form.state;
          dataPost.summary = this.form.summary;
          dataPost.abnormal = this.form.abnormal;
          dataPost.maintenance = this.form.maintenance;
          var reportInfo=JSON.stringify(dataPost);

          $.ajax({
            url:"/api/v1/info/inspection",
            type:"PUT",
            contentType:"application/json",
            dataType:"JSON",
            data:reportInfo,
            success:function () {
              vm.dialogEditVisible=false;
              vm.getTempArr();
              vm.resetForm()
              vm.showDetail(dataDate)
            },
            error:function (err) {
              console.log("加载编辑失败")
            }
          })


        },

        //查看详情
        handleCheck(id) {
          var vm=this;
          this.transID=id;
          var dataCheck={}
          dataCheck.reportId=this.transID;

          $.ajax({
            url:"/api/v1/info/inspectionById",
            type:"GET",
            //   contentType:"application/json",
            dataType:"JSON",
            data:dataCheck,
            success:function (msg) {
              vm.form.id=msg.id;
              vm.form.duty_person=msg.duty_person;
              vm.form.inspection_person=msg.inspection_person;
              vm.form.create_date=vm.Hour(msg.create_date);
              vm.form.calendar_date=vm.Timestamp(msg.calendar_date);
              vm.form.state=msg.state;
              vm.form.summary=msg.summary;
              vm.form.abnormal=msg.abnormal;
              vm.form.maintenance=msg.maintenance;
              vm.dialogCheckVisible=true;
              console.log("查看信息成功")
            },
            error:function (err) {
              console.log("加载查看失败")
            }
          })
        },
        handleCheckConfirm(){
          this.dialogCheckVisible=false;
        },

        //删除该日历
        handleDelete(id) {
          var vm=this;
          this.dialogDeleteVisible=true

          this.transID=id;
          var dataEdit={}
          dataEdit.reportId=this.transID;

          //@Todo 删除接口
          $.ajax({
            url:"/api/v1/info/inspectionById",
            type:"GET",
            //   contentType:"application/json",
            dataType:"JSON",
            data:dataEdit,
            success:function (msg) {

              vm.calendar_date=vm.Timestamp(msg.calendar_date);
              console.log("查看删除信息日期成功")
            },
            error:function (err) {
              console.log("加载编辑失败")
            }
          })

        },
        handleDeleteConfirm(){
          var vm=this;
          var dataDelete={}
          dataDelete.inspectionId=this.transID;
          var pp= Math.round(new Date(this.calendar_date).getTime()/1000).toString();
          var p=vm.Timestamp(pp);

          $.ajax({
            url:"/api/v1/info/inspectionId?inspectionId="+dataDelete.inspectionId,
            type:"DELETE",
            contentType:"application/json",
            dataType:"text",
            //    data: dataDelete,
            success:function () {
              vm.dialogDeleteVisible=false;
              vm.getTempArr();
              vm.getTotalPage(p)
              vm.pageInfo.pageCode=1;
              vm.showDetail(p);
              console.log("删除成功")
            },
            error:function (err) {
              console.log("加载删除失败")
            }

          })

        },

        //清空表单
        resetForm() {
          this.form = {
            duty_person: '',
            inspection_person: '',
            state:'',
            summary:'',
            abnormal:'',
            maintenance:''
          }
        },
      }
    }
</script>
<style>
  * {
    box-sizing: border-box;
  }
  ul {
    list-style-type: none;
  }
  .container{
    width: 100%;
    height:100%;
    display: flex;
    justify-content: space-between;
    flex-direction: row;
  }
  #calendar {
    width: 100%;
    margin: 0 auto;
  }
  .arr {
    padding: 15px;
  }
  .month {
    width: 100%;
    background: #f45246;
  }
  .month ul {
    margin: 0;
    padding: 0;
    display: flex;
    justify-content: space-between;
  }

  .year-month {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
  }
  .year-month:hover {
    background: rgba(150, 2, 12, 0.1);
  }
  .choose-year {
    padding-left: 20px;
    padding-right: 20px;
  }
  .choose-month {
    text-align: center;
    font-size: 1.5rem;
  }
  .arrow:hover {
    background: rgba(100, 2, 12, 0.1);
  }
  .month ul li {
    color: white;
    font-size: 20px;
    text-transform: uppercase;
    letter-spacing: 3px;
  }
  .weekdays {
    margin: 0;
    padding: 10px 0;
    background-color: #fff;
    display: flex;
    flex-wrap: wrap;
    color: #f78989;
    justify-content: space-around;
  }

  .weekdays li {
    display: inline-block;
    width: 13.6%;
    text-align: center;
  }
  .days {
    padding: 0;
    background: #FFFFFF;
    margin: 0;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
  }

  .days li {
    list-style-type: none;
    display: inline-block;
    width: 14.2%;
    height: 70px;
    text-align: center;
    font-size: 1rem;
    color: #000;
  }
  .days li .active {

    width:56px;
    height:10px;
    border-width:0 0 15px 15px;
    border-style:solid;
    border-color:transparent transparent transparent #6c6;
    margin:30px auto;
    margin-left:5px;
    position:relative;
  }

  .days li .error{

    width:56px;
    height:10px;
    border-width:0 0 15px 15px;
    border-style:solid;
    border-color: transparent transparent transparent #ff6f00;
    margin:25px auto;
    margin-left:5px;
    position:relative;
  }
  .days li .imp{

    border-width:0px 0px 15px 15px;
    border-style:solid;
    border-color: transparent transparent  #651fff transparent ;
    margin-left:35px;
    position:relative;
  }

  .days li .other-month {
    color: gainsboro;
    line-height: 70px;
  }

  .days li .normal {
    line-height: 70px;
  }

  .days li .normal:hover {
    background: #e1e1e1;
  }

  .days li:hover {
    background: #e1e1e1;
  }

  .container .showEvent{
    min-width: 400px;
  }
  .container .showEvent .title{
    width: 100%;
    height: 55px;
    background:#fff;
    line-height: 55px;
    font-size: 20px;
    color: #bc8f8f;
    font-weight: bold;
    text-align: center;
  }

  .container .showEvent .btm{
    line-height: 40px;
    border-bottom: 1px solid #ccc;

  }
  .container .showEvent>div:not(first){
    padding: 5px 5px;

  }
  .normal{
    font-family: Verdana, sans-serif;
    background: #ffffff;
  }
  .showEvent{
    border-left:1px solid #ccc;
    background-color:#ffffff;
  }
  .item{
    margin-left:10px;
    padding:50px; width:380px; height:143px;
    line-height:22px;
    border: 0.8px solid #bc8f8f;
    -moz-border-radius: 15px;
    -webkit-border-radius: 15px;
    border-radius:15px;
  }
  .buttonstyle{
    margin-top:5px;
  }
  .title{
    color:#0f0f0f;
  }
  .el-icon-circle-plus{
    font-size:60px;
    color:#f45246;
    position: fixed;
    bottom: 40px;
    right: 50px;

  }
</style>
