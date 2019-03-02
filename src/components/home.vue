<template>
  <div id="msg">
  <nav class="navbar navbar-default top-navbar" role="navigation">
    <div class="navbar-header">
      <button type="button" class="navbar-toggle waves-effect waves-dark" data-toggle="collapse" data-target=".sidebar-collapse">
        <span class="sr-only">Toggle navigation</span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
      </button>
      <a class="navbar-brand waves-effect waves-dark" href="index.html"><i class="large material-icons">track_changes</i> <strong>信息管理系统</strong></a>

      <div id="sideNav" href=""><i class="material-icons dp48">toc</i></div>
    </div>

    <ul class="nav navbar-top-links navbar-right">
      <li><a class="dropdown-button waves-effect waves-dark" href="#!" data-activates="dropdown1"><i class="fa fa-user fa-fw"></i> <b>{{userName}}</b></a></li>
    </ul>
  </nav>
  <nav class="navbar-default navbar-side" role="navigation">
    <div class="sidebar-collapse">
      <ul class="nav" id="main-menu">
        <li>
          <router-link to="/gis" class="waves-effect waves-dark"><i class="fa fa-qrcode"></i>地图模块</router-link>
        </li>
        <li>
          <a href="#" class="waves-effect waves-dark"><i class="fa fa-sitemap"></i> 视频<span class="fa arrow"></span></a>
          <ul class="nav nav-second-level">

            <li>
              <router-link to="/splitScreen">分屏</router-link>
            </li>
            <li>
              <router-link to="/round">轮询</router-link>
            </li>


              </ul>

            </li>
       <!-- <li>
          <router-link to="/uielement"class="waves-effect waves-dark"><i class="fa fa-desktop"></i> 巡检计划</router-link>
        </li>-->
        <li>
          <router-link to="/calendar"class="waves-effect waves-dark"><i class="fa fa-desktop"></i>巡检计划</router-link>
        </li>
        <li>
          <router-link to="/deviceList" class="waves-effect waves-dark"><i class="fa fa-bar-chart-o"></i> 设备信息</router-link>
           </li>
        <li>
          <router-link to="/tables" class="waves-effect waves-dark"><i class="fa fa-qrcode"></i>入廊作业</router-link>
        </li>

        <li>
          <router-link to="/forms" class="waves-effect waves-dark"><i class="fa fa-table"></i> 应急预案 </router-link>
        </li>
        <li>
          <a href="#" class="waves-effect waves-dark"><i class="fa fa-sitemap"></i>预案审批<span class="fa arrow"></span></a>
          <ul class="nav nav-second-level">

            <li>
              <router-link to="/undone">未审批</router-link>
            </li>
            <li>
              <router-link to="/done">已审批</router-link>
            </li>
            <li>
              <router-link to="/all">审批结果</router-link>
            </li>

          </ul>

        </li>
        <li>
          <a href="#" class="waves-effect waves-dark"><i class="fa fa-sitemap"></i> 应急资源<span class="fa arrow"></span></a>
          <ul class="nav nav-second-level">

            <li>
              <router-link to="/goods">应急救援物资</router-link>
            </li>
            <!--  <a href="#">应急救援人员物资数据<span class="fa arrow"></span></a>
              <ul class="nav nav-third-level">
                <li>
                  <router-link to="/goods">应急救援物资</router-link>
                </li>
              </ul>
           -->

          </ul>
        </li>

      </ul>

    </div>

  </nav>
<keep-alive> <router-view/></keep-alive>
    </div>
</template>

<script>
    export default {
      data(){
        return{
          userName:''
        }
      },
      created: function () {
        this.userName=localStorage.getItem("name");
        this.getSessionId()
      },
      methods:{
        getSessionId:function(){
          var vm=this;

          $.ajax({
            type: "GET",
          contentType: "application/json; charset=utf-8",
            xhrFields: {
              withCredentials: true
            },
            crossDomain: true,
            //  header:"Access-Control-Allow-Origin:  http://10.112.17.185:8100",
            url: "/api/v1/user/authorize",
            success: function (msg,res) {

              var ses=JSON.parse(msg)
            //  var session=msg.session
              var mm=ses.session;

              vm.setCookie("JSESSIONID",mm,7000)


            },
            error: function (err) {
       //       console.log("加载失败");
            }
          });
        },
        setCookie: function (cname, cvalue, exdays) {
          var d = new Date();
          d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
          var expires = "expires=" + d.toUTCString();
      //    console.info(cname + "=" + cvalue + "; " + expires);
          document.cookie = cname + "=" + cvalue + "; " + expires;
      //    console.info(document.cookie);
        },
        //获取cookie
        getCookie: function (cname) {
          var name = cname + "=";
          var ca = document.cookie.split(';');
          console.log("获取cookie,现在循环")
          for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            console.log(c)
            while (c.charAt(0) == ' ') c = c.substring(1);
            if (c.indexOf(name) != -1){
              return c.substring(name.length, c.length);
            }
          }
          return "";
        }
      }
    }
</script>

<style scoped>
  /*.router-link-active,.active-menu{

  }*/
  .router-link-active,.myActive{
    color: cornflowerblue;
    font-weight: bold;
    font-style: italic;
    font-size: larger;
  }

</style>
