import Vue from 'vue';
import Vuex from 'vuex'

Vue.use(Vuex);

/**
 * 数据的增删改查数据流，同时控制列表界面弹窗的显隐
 */
const ItemActionOptions = {
    namespaced: true,
    actions: {},
    mutations: {
        //添加数据，添加数据可能需要一些初始值需要从value里传入
        createItem(state, value) {
            state.actionItem = value;
            state.showDialog = true
            state.isEdit = false;
            state.actionType = 'CREATE';
        },
        //根据当前数据快速添加数据，添加数据可能需要一些初始值需要从value里传入
        cloneItem(state, value) {
            state.actionItem = value;
            state.showDialog = true
            state.isEdit = false;
            state.actionType = 'CLONE';
        },

        //编辑数据，在列表界面添加，在Action弹窗组件里获取
        editItem(state, value) {
            state.actionItem = value;
            state.showDialog = true;
            state.isEdit = true;
            state.actionType = 'EDIT';
        },


        showItem(state, value) {
            state.showDialog = true
            state.actionItem = value;
            state.actionType = 'SHOW';
        },
        //取消或者关闭Action弹窗
        cancelItemAction(state, value) {
            //关闭弹窗不操作任何 actionItem 否则会报错
            state.showDialog = false
            state.actionItem = {}
            //刷新列表页面
        }
    },
    state: {
        actionItem: {}, //正在编辑的数据
        isEdit: false,//操作种类 DELETE
        // 新增 CREATE
        // 快速新增 CLONE
        // 删除 DELETE
        // 编辑 EDIT
        // 查看 SHOW
        actionType: "",//操作种类
        showDialog: false //编辑数据的对话框显隐控制项
    },
    getters: {}
}

/**
 * 记录当前已认证的用户信息、token和菜单
 */
const SessionOptions = {
    namespaced: true,
    actions: {},
    mutations: {
        storePrincipal(state, value) {
            state.principal = value
        },

    },
    state: {
        principal: {},
        token: {}
    },
}

export default new Vuex.Store({
    modules: {
        ItemActionAbout: ItemActionOptions,
        SessionAbout: SessionOptions
    }
})