<template>
  <div class="inner-bg">
    <div class="container">
      <div class="row" style="position:relative;top:200px;">
        <div class="col-sm-8 col-sm-offset-2 text">
          <h1 class="messagehead" align="center" style="color:#EEEEEE;">信息管理平台登录</h1>
        </div>
      </div>
      <div class="row" style="position:relative;top:250px;">
        <div class="col-sm-6 col-sm-offset-3 form-box">
          <div class="form-top">
            <div class="form-top-left">
              <i class="fa fa-lock" style="color:#EEEEEE;"></i>
              <span class="loginp" style="color:#EEEEEE;">请输入用户名密码：</span>
            </div>

            <br>
          </div>
  <div id="login">
    <input type="text" v-model="loginForm.username" placeholder="用户名" style="color:#EEEEEE"/>
    <input type="password" v-model="loginForm.password" placeholder="密码"style="color:#EEEEEE"/>
    <el-button @click="login" style="width:550px;height:34px;background-color:#66B1FF;">登录</el-button>
  </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
  import { mapMutations } from 'vuex';
  export default {
    data () {
      return {
        loginForm: {
          username: '',
          password: ''
        },
        userToken: ''
      };
    },

    methods: {
      ...mapMutations(['changeLogin']),
      login () {
        let _this = this;
        if (this.loginForm.username === '' || this.loginForm.password === '') {
          _this.$message({
            message: '账号密码不能为空',
            type: 'warning'
          });
        } else {
          const dataPost= {username:this.loginForm.username,password:this.loginForm.password};
        //  var data = JSON.stringify(dataPost);
           this.axios({
            contentType: 'application/json; charset=utf-8',
            method: 'post',
            url: '/api/v1/user/login',
             withCredentials:true,
            dataType:"text",
            data:dataPost
          }).then(res => {
            console.log(res.data);
             console.log(res.data.tenantId);
            _this.userToken = res.data.access_token;
            // 将用户token保存到vuex中
            localStorage.setItem("tenant_id",res.data.tenant_id);
            localStorage.setItem("auth",res.data.access_token);
            console.log(res.data.tenant_id+"hhh")
            this.setCookie("tenant_id",res.data.tenant_id,7000);
            this.setCookie("auth",res.data.access_token,7000);
            console.log(_this.userToken+"mmp")
            _this.changeLogin({ Authorization: _this.userToken });
            _this.$router.push('/home');
             this.$message({
               message: '登陆成功',
               type: 'success'
             });
          }).catch(error => {
             this.$message({
               message: '账号密码错误',
               type: 'warning'
             });
            console.log(error);
          });
        }
      },
      setCookie: function (cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        console.info(cname + "=" + cvalue + "; " + expires);
        document.cookie = cname + "=" + cvalue + "; " + expires;
        console.info(document.cookie);
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
  };
</script>
<style>


</style>
