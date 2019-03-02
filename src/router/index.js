import Vue from 'vue';
import Router from 'vue-router';
import login from '@/components/login';
import home from '@/components/home';
import splitScreen from '@/components/splitScreen.vue'
import Forms from '@/components/Forms.vue'
import Tables from '@/components/Tables.vue'
import UIElement from '@/components/UIElement.vue'
import Calendar from '@/components/calendar.vue'
import Goods from '@/components/Goods.vue'
import gis from '@/components/gis.vue'
import DeviceList from '@/components/DeviceList.vue'
import Round from '@/components/Round.vue'
import All from '@/components/All.vue'
import Done from '@/components/Done.vue'
import Undone from '@/components/Undone.vue'

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
          path: '/splitScreen',
          component: splitScreen,

        },
        {
          path: '/round',
          component: Round,

        },
        {
          path: '/forms',
          component: Forms
        },
        {
          path: '/tables',
          component: Tables
        },

     /*   {
          path: '/uielement',
          component: UIElement
        },*/

        {
          path: '/calendar',
          component:Calendar
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
          path:'Table',
          component:Tables
        },
        {
          path: '/deviceList',
          component: DeviceList
        },
        {
          path:'/all',
          component:All
        },
        {
          path:'/undone',
          component:Undone
        },
        {
          path:'/done',
          component:Done
        },
      ],redirect:'/gis'
    }
  ],
  linkActiveClass:'myActive'
});

// 导航守卫
// 使用 router.beforeEach 注册一个全局前置守卫，判断用户是否登陆
router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    next();
  }
  else {

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

