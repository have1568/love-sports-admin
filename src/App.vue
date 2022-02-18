<template>
  <!-- App.vue -->
  <v-app v-if="$route.meta.public !== true">
    <AppDrawer></AppDrawer>
    <AppTopBar></AppTopBar>

    <!-- 根据应用组件来调整你的内容 -->
    <v-main>
      <!-- 给应用提供合适的间距 -->

        <!-- 如果使用 vue-router -->
        <router-view></router-view>

      <v-footer absolute  class="pa-3">
        <span>isocked.com Design &copy; {{ new Date().getFullYear() }}</span>
        <v-spacer/>
        <span class="caption mr-1">Make With Love</span>
        <v-icon color="pink" small>mdi-heart</v-icon>
      </v-footer>
    </v-main>
    <v-overlay
        ref="SpinnerLoading"
        :value="Loading"
        color="#E1F5FE"
        :z-index="6"
        :opacity="0.7"
    >
      <fulfilling-square-spinner
          :animation-duration="4000"
          :size="50"
          color="primary"
      />
    </v-overlay>
    <v-snackbar v-model="snackbar.show" app :timeout="snackbar.timeout" :color="snackbar.color" :multi-line="true"
                :right="true">
      {{ snackbar.text }}
      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click="snackbar.show = false">关闭</v-btn>
      </template>
    </v-snackbar>
  </v-app>
  <v-app v-else>
    <router-view></router-view>
  </v-app>
</template>
<script>
import AppDrawer from "./components/layout/AppDrawer";
import AppTopBar from "./components/layout/AppTopBar";
import {FulfillingSquareSpinner} from "epic-spinners";
import API from './router/API'

import {mapMutations} from "vuex";

export default {
  components: {
    AppDrawer,
    AppTopBar,
    FulfillingSquareSpinner,
  },
  name: "App",
  data(){
    return {
      initialized: false,
      Loading: false,
      breadcrumbs: [],
      principal: {},
      snackbar: {
        show: false,
        code: 200,
        text: '请求错误',
        timeout: 2000,
        color: "red"
      }
    }
  },
  methods: {
    ...mapMutations('SessionAbout', ['storePrincipal']),
    //获取用户信息
    initialize() {
      this.initialized = true
      this.$http.get(API.USERINFO)
          .then((response) => {
            this.principal = response.data
            this.storePrincipal(this.principal)
          })
    },
    showLoading(isShow) {
      this.Loading = isShow;
    },

    showAxiosMessage(snackbar) {
      this.snackbar = snackbar;
    },
    handleLoginOut() {

    },
    handleSetting() {
    },
    handleProfile() {
    },

  },
  mounted() {
    this.$bus.$on("showLoading", this.showLoading);
    this.$bus.$on("showAxiosMessage", this.showAxiosMessage);

    //如果没有执行初始化方法，则执行方法获取用户信息
    if (!this.initialized) {
      this.initialize()
      return
    }
    //登录完成之后再获取用户信息
    this.$bus.$on("LoginComplete", this.initialize);

  },
};
</script>
