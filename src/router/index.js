import Vue from 'vue';
import VueRouter from 'vue-router';
import VueCookies from 'vue-cookies';
import {routes} from './Paths'
Vue.use(VueRouter)
Vue.use(VueCookies)
console.log("Router Index")



const router = new VueRouter({
    routes,
    mode: 'history',
})

// router.beforeEach((to, from, next) => {
//   console.log(to)
//   console.log(from)
//   console.log(next)
// })

export default router
