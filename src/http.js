/**
 * Created by superman on 17/2/16.
 * http配置
 */

import axios from 'axios'

// axios 配置
axios.defaults.timeout = 5000
axios.defaults.baseURL = 'http://localhost:8080/'

// http request 拦截器
// 添加请求拦截器，在请求头中加token
axios.interceptors.request.use(
  config => {
    if (localStorage.getItem('Authorization')) {
    //  config.headers.Authorization = localStorage.getItem('Authorization');
    }

    return config;
  },
  error => {
    return Promise.reject(error);
  });

// http response 拦截器
axios.interceptors.response.use(
  response => {
    return response
  },
  error => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // 401 清除token信息并跳转到登录页面
       //   localStorage.removeItem('Authorization');
          this.$router.push('/login');
      }
    }
    // console.log(JSON.stringify(error));//console : Error: Request failed with status code 402
    return Promise.reject(error.response.data)
  },
)

export default axios
