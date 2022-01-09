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
        component: () => import('../components/contents/Dashboard.vue')
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
            window.location.href = "http://localhost:8081/oauth/authorize?client_id=love-sports-admin&scope=userinfo%20role%20resources&response_type=code&redirect_uri=http://localhost:8080/token"
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
        component: () => import('../components/contents/user/SysUserInfo')
    },
    {
        path: '/permission/role',
        name: 'Role',
        component: () => import('../components/contents/role/SysRole')
    },
    {
        path: '/system/app',
        name: 'Client',
        component: () => import('../components/contents/client/Client')
    },
    {
        path: '/404',
        meta: {
            public: true,
        },
        name: 'NotFound',
        component: () => import(`@/views/NotFound.vue`)
    },
    {
        path: '/403',
        meta: {
            public: true,
        },
        name: 'AccessDenied',
        component: () => import(`@/views/Deny.vue`)
    },
    {
        path: '/500',
        meta: {
            public: true,
        },
        name: 'ServerError',
        component: () => import( `@/views/Error.vue`)
    },
]