import Vue from 'vue';
import VueRouter from 'vue-router';
import axios from 'axios';
import VueAxios from 'vue-axios';
import VueCookies from 'vue-cookies';
import qs from 'qs';
import API from './api.js'

Vue.use(VueRouter, axios, VueAxios, VueCookies)
console.log(VueCookies)
let token = code => {
  axios({
    url: API.OAUTH_TOKEN,  //请求路径（接口）
    method: 'POST', //请求方式
    headers: { 'Authorization': 'Basic bG92ZS1zcG9ydHMtYWRtaW46MTIzNDU2', 'content-type': 'application/x-www-form-urlencoded' }, // 请求头，发送FormData格式的数据，必须是 这种请求头。
    data: qs.stringify({ 'code': code, 'grant_type': 'authorization_code', 'redirect_uri': 'http://localhost:8080/token', 'scope': 'all' }),
  }).then(function (response) {
    console.log(response)
    VueCookies.set("token", JSON.stringify(response.data), response.data.expires_in * 1)
    console.log(VueCookies.get("token"))
  });
}

let refreshToken = () => {

}

const routes = [
  {
    path: '*',
    meta: {
      public: true,
    },
    redirect: {
      path: '/404'
    }
  },
  {
    path: '/',
    name: 'Home',
    component: import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/token',
    redirect: to => {
      let code = to.query.code;
      if (code) {
        token(code)
      }
      return { path: '/about', query: null }
    }
  },
  {
    path: '/login', redirect: to => {
      console.log(to)
      window.location.href = "http://localhost:8081/oauth/authorize?client_id=love-sports-admin&scope=all&response_type=code&redirect_uri=http://localhost:8080/token"
      // 方法接收 目标路由 作为参数
      // return 重定向的 字符串路径/路径对象
    }
  },
  {
    path: '/permission/resources',
    name: 'Resources',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '../components/contents/SysResources.vue'
    )
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/404',
    meta: {
      public: true,
    },
    name: 'NotFound',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      `@/views/NotFound.vue`
    )
  },
  {
    path: '/403',
    meta: {
      public: true,
    },
    name: 'AccessDenied',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      `@/views/Deny.vue`
    )
  },
  {
    path: '/500',
    meta: {
      public: true,
    },
    name: 'ServerError',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      `@/views/Error.vue`
    )
  },
  // {
  //   path: '/login',
  //   meta: {
  //     public: true,
  //   },
  //   name: 'Login',
  //   component: () => import(
  //     /* webpackChunkName: "routes" */
  //     /* webpackMode: "lazy-once" */
  //     `@/views/Login.vue`
  //   )
  // },
]

const router = new VueRouter({
  routes,
  mode: 'history',
})
export default router
