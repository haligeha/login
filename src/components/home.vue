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
      <li><a class="dropdown-button waves-effect waves-dark" href="#!" data-activates="dropdown1"><i class="fa fa-user fa-fw"></i> <b>John Doe</b> <i class="material-icons right">arrow_drop_down</i></a></li>
    </ul>
  </nav>
  <nav class="navbar-default navbar-side" role="navigation">
    <div class="sidebar-collapse">
      <ul class="nav" id="main-menu">
        <li>
          <router-link to="/hello" class="active-menu waves-effect waves-dark"><i class="fa fa-dashboard"></i> 视频</router-link>
        </li>
        <li>
          <router-link to="/uielement"class="waves-effect waves-dark"><i class="fa fa-desktop"></i> 巡检计划</router-link>
        </li>
        <li>
          <router-link to="/deviceList" class="waves-effect waves-dark"><i class="fa fa-bar-chart-o"></i> 设备信息</router-link>
           </li>
        <li>
          <router-link to="/tables" class="waves-effect waves-dark"><i class="fa fa-qrcode"></i>入廊作业</router-link>
        </li>
        <li>
          <router-link to="/gis" class="waves-effect waves-dark"><i class="fa fa-qrcode"></i>WebGis</router-link>
        </li>
        <li>
          <router-link to="/forms" class="waves-effect waves-dark"><i class="fa fa-table"></i> 应急预案 </router-link>
        </li>

        <!--  <router-link to="/empty" class="waves-effect waves-dark"><i class="fa fa-fw fa-file"></i> 员工信息</router-link>
        </li>-->
        <li>
          <a href="#" class="waves-effect waves-dark"><i class="fa fa-sitemap"></i> 应急资源<span class="fa arrow"></span></a>
          <ul class="nav nav-second-level">
            <li>
              <a href="#">应急救援人员物资数据<span class="fa arrow"></span></a>
              <ul class="nav nav-third-level">
                <li>
                  <router-link to="/goods">应急救援物资</router-link>
                </li>
                <li>
                  <router-link to="/equipment">应急救援装备</router-link>
                </li>
                <li>
                  <router-link to="/rescueTeam">应急救援队伍</router-link>
                </li>
                <li>
                  <router-link to="/shelter">应急避难场所</router-link>
                </li>
              </ul>

            </li>



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
        name: "home",
    }
</script>

<style scoped>

</style>
