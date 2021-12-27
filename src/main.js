import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueCookies from 'vue-cookies'
import API from './router/API.js'

Vue.config.productionTip = false

Vue.use(VueAxios, axios)
Vue.use(VueCookies)

console.log("Main js")

const initAxios = (_this) => {
    // Add a request interceptor
    axios.interceptors.request.use(function (config) {
        Vue.prototype.$bus.$emit("showLoading", true);
        //如果不是获取token的URL则拦截
        if (!(config.url === API.OAUTH_TOKEN || config.url === API.USERINFO)) {
            let token = Vue.$cookies.get('token');
            console.log(token)
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
        console.log(error)
        // Do something with request error
        return Promise.reject(error);
    });

    // Add a response interceptor
    axios.interceptors.response.use(function (response) {
        // Do something with response data
        Vue.prototype.$bus.$emit("showLoading", false);
        return response;
    }, function (error) {
        console.log(error);
        console.log(_this);
        //_this.$router.push("/login")
        // Do something with response error
        return Promise.reject(error);
    });
}

new Vue({
    router,
    vuetify,
    render: h => h(App),
    beforeCreate() {
        Vue.prototype.$bus = this
        initAxios(this);
        console.log("beforeCreate")
    }
}).$mount('#app')
