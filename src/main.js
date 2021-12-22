import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueCookies from 'vue-cookies'
import API from './router/api.js'

Vue.config.productionTip = false

Vue.use(VueAxios, axios)
Vue.prototype.$axios = axios

// Add a request interceptor
axios.interceptors.request.use(function (config) {
  //如果不是获取token的URL则拦截
  if (!(config.url == API.OAUTH_TOKEN)) {
    let token = VueCookies.get('token');
    // token过期、失效或者不存在
    if (!token) {
      router.push("/login")
    }
    if (token.access_token) {
      config.headers.common['Authorization'] = 'Bearer ' + token.access_token
    }
  }
  return config;
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});

// Add a response interceptor
axios.interceptors.response.use(function (response) {
  // Do something with response data
  return response;
}, function (error) {
  // Do something with response error
  return Promise.reject(error);
});

const vue = new Vue({
  router,
  vuetify,
  VueAxios,
  axios,
  VueCookies,
  render: h => h(App)
}).$mount('#app')
