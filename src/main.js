// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router/index'
import axios from './http'
import store from './store/index'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/js/bootstrap.min.js'


//Vue.config.productionTip = false
Vue.use(ElementUI)
axios.defaults.withCredentials  = true;
Vue.prototype.axios = axios;
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  axios,
 // components: { App },
//  template: '<App/>'
//})
  render: h => h(App)
}).$mount('#app');
