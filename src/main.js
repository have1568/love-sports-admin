import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueCookies from 'vue-cookies'
import store from './store'
import {initAxiosConfig} from './utils/AxiosConfig'

Vue.config.productionTip = false
Vue.use(VueAxios, axios)
Vue.use(VueCookies)
new Vue({
    router,
    vuetify,
    render: h => h(App),
    store,
    beforeCreate() {
        Vue.prototype.$bus = this
        initAxiosConfig(Vue, router);
    }
}).$mount('#app')
