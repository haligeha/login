import Vue from 'vue';
import Router from 'vue-router';
import login from '@/components/login';
import home from '@/components/home';
import HelloWorld from '@/components/HelloWorld.vue'
import Forms from '@/components/Forms.vue'
import Tables from '@/components/Tables.vue'
import UIElement from '@/components/UIElement.vue'
import Goods from '@/components/Goods.vue'
import gis from '@/components/gis.vue'
import DeviceList from '@/components/DeviceList.vue'

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/home',
      name: 'home',
      component: home,
      meta: {
        requireAuth: true
       },
      children:[
        {
          path: '/hello',
          component: HelloWorld,

        },
        {
          path: '/hello',
          component: HelloWorld,

        },
        {
          path: '/forms',
          component: Forms
        },
        {
          path: '/tables',
          component: Tables
        },

        {
          path: '/uielement',
          component: UIElement
        },
        {
          path: '/goods',
          component: Goods
        },
        {
          path: '/gis',
          component: gis
        },
        {
          path: '/deviceList',
          component: DeviceList
        }
      ]
    }
  ]
});

// 导航守卫
// 使用 router.beforeEach 注册一个全局前置守卫，判断用户是否登陆
router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    next();
  }
  else {
    console.log("hellohi");
    let token = localStorage.getItem('Authorization');
    if (token === null || token === '') {
      next('/login');
    }
    else {
      console.log(token);
      next();
    }
  }
});

export default router;

