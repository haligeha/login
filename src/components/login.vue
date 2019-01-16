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
          alert('账号或密码不能为空');
        } else {
          const dataPost= {username:this.loginForm.username,password:this.loginForm.password};
        //  var data = JSON.stringify(dataPost);
          this.axios({
            method: 'post',
            url: '/api/v1/info/login',
            dataType:"text",
          //  data: {username:"TenantAdmin@bupt.edu.cn",password:"password"}
            data:dataPost
          }).then(res => {
            console.log(res.data);
            _this.userToken = res.data.access_token;
            // 将用户token保存到vuex中
           // localStorage.setItem(res.data.tenantId);
            console.log(res.data.tenant_id+"hhh")
            localStorage.setItem("tenant_id",res.data.tenant_id);
            localStorage.setItem("auth",res.data.access_token);

            console.log(_this.userToken+"mmp")
            _this.changeLogin({ Authorization: _this.userToken });
            _this.$router.push('/home');
            alert('登陆成功');
          }).catch(error => {
            alert('账号或密码错误');
            console.log(error);
          });
        }
      }
    }
  };
</script>
<style>


</style>
