<template>
  <!-- App.vue -->
  <v-app v-if="$route.meta.public !== true">
    <AppDrawer
        :menus="items"
        :enable-mini="mini"
        :principal="principal"
    ></AppDrawer>
    <v-app-bar elevation="0" app dark color="blue" class="border-radius">
      <v-app-bar-nav-icon
          transition="fab-transition"
          @click.stop="mini = !mini"
      >
        <v-icon>{{ toggleNavIcon }}</v-icon>
      </v-app-bar-nav-icon>
      <v-btn icon>
        <v-icon>mdi-home</v-icon>
      </v-btn>
      <v-breadcrumbs large :items="breadcrumbs"></v-breadcrumbs>
      <v-spacer></v-spacer>
      <v-btn icon>
        <v-icon>mdi-magnify</v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon>mdi-heart</v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon>mdi-dots-vertical</v-icon>
      </v-btn>
    </v-app-bar>


    <!-- 根据应用组件来调整你的内容 -->
    <v-main>
      <!-- 给应用提供合适的间距 -->
      <v-container fluid>
        <!-- 如果使用 vue-router -->
        <router-view></router-view>
      </v-container>
    </v-main>
    <v-footer  app padless color="white">
      <v-col class="text-center" cols="12">
        {{ new Date().getFullYear() }} —
        <strong>Vuetify</strong>
      </v-col>
    </v-footer>
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
          color="#ff1d5e"
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
import AppDrawer from "./components/layout/AppDrawer.vue";
import {FulfillingSquareSpinner} from "epic-spinners";
import API from './router/API'

import {mapMutations} from "vuex";

export default {
  components: {
    AppDrawer,
    FulfillingSquareSpinner,
  },
  name: "App",
  data: () => ({
    initialized: false,
    Loading: false,
    drawer: true,
    items: [],
    mini: true,
    breadcrumbs: [],
    principal: {},
    snackbar: {
      show: false,
      code: 200,
      text: '请求错误',
      timeout: 2000,
      color: "red"
    }

  }),
  computed: {
    toggleNavIcon() {
      return this.mini
          ? "mdi-format-indent-increase"
          : "mdi-format-indent-decrease";
    },
  },
  methods: {
    ...mapMutations('SessionAbout', ['storePrincipal']),
    //获取用户信息
    initialize() {
      this.initialized = true
      this.$http.get(API.USERINFO)
          .then((response) => {
            this.principal = response.data
            this.menus = response.data.resources
            this.storePrincipal(this.principal)
          })
    },
    showLoading(isShow) {
      this.Loading = isShow;
    },

    showAxiosMessage(snackbar) {
      this.snackbar = snackbar;
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
