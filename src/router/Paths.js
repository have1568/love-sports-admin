export const routes = [
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
        path: '/dashboard',
        name: 'Dashboard',
        component: () =>import('../components/contents/Dashboard.vue')
    },
    {
        path: '/token',
        redirect: to => {
            //获取到 code 后跳转至
            return {path: '/login/complete', query: to.query}
        }
    },

    {
        path: '/login/complete',
        name: 'Complete',
        meta: {
            public: true,
        },
        component: () => import('@/views/LoginComplete.vue')
    },
    {
        path: '/login', redirect: to => {
            window.location.href = "http://localhost:8081/oauth/authorize?client_id=love-sports-admin&scope=all&response_type=code&redirect_uri=http://localhost:8080/token"
            // 方法接收 目标路由 作为参数
            // return 重定向的 字符串路径/路径对象
        }
    },
    {
        path: '/permission/resources',
        name: 'Resources',
        component: () => import('../components/contents/resources/SysResources.vue')
    },
    {
        path: '/permission/user',
        name: 'User',
        component: () => import('../components/contents/user/SysUser.vue')
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