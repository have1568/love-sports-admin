<template>
  <!-- App.vue -->
  <v-app v-if="$route.meta.public != true">
    <atom-spinner
          :animation-duration="1000"
          :size="60"
          :color="'#ff1d5e'"
     />
    <AppDrawer :menus="items" :enable-mini="mini" :principal="principal"></AppDrawer>
    <v-card class="mx-auto overflow-hidden">
      <v-app-bar elevation="0" app>
        <v-app-bar-nav-icon @click.stop="mini = !mini">
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
    </v-card>

    <!-- 根据应用组件来调整你的内容 -->
    <v-main>
      <!-- 给应用提供合适的间距 -->
      <v-container fluid>
        <!-- 如果使用 vue-router -->
        <router-view></router-view>
      </v-container>
    </v-main>
    <v-footer padless>
      <v-col class="text-center" cols="12">
        {{ new Date().getFullYear() }} —
        <strong>Vuetify</strong>
      </v-col>
    </v-footer>
  </v-app>
  <v-app v-else>
    <atom-spinner
          :animation-duration="1000"
          :size="60"
          :color="'#ff1d5e'"
     />
    <router-view></router-view>
  </v-app>
</template>
<script>
import AppDrawer from "./components/Layout/AppDrawer.vue";
import { AtomSpinner } from 'epic-spinners'
export default {
  components: {
    AppDrawer,
    AtomSpinner,
  },
  name: 'App',
  data: () => ({
    spinnerVisible: true,
    drawer: true,
    items: [],
    mini: false,
    breadcrumbs: [],
    principal: {},
  }),
  created() {
    this.initialize();
    // EventBus.$on('before-request', this.showSpinner);
    // EventBus.$on('request-error', this.hideSpinner);
    // EventBus.$on('after-response', this.hideSpinner);
    // EventBus.$on('response-error', this.hideSpinner);
  },
  computed: {
    toggleNavIcon() {
      return this.mini
        ? "mdi-format-indent-increase"
        : "mdi-format-indent-decrease";
    },
  },
  beforeDestroy() {
    // EventBus.$off('before-request', this.showSpinner);
    // EventBus.$off('request-error', this.hideSpinner);
    // EventBus.$off('after-response', this.hideSpinner);
    // EventBus.$off('response-error', this.hideSpinner);
  },
  watch: {

  },
  methods: {
    initialize() {
      this.$axios.get("/love_sports/love-sports-auth/auth/userinfo")
        .then((response) => {
          console.log(response.data)
          this.principal = response.data.data
          this.menus = response.data.data.resources
        })
    },

    createBreadcrumbs() {

    },
    showSpinner() {
      console.log('show spinner');
      this.spinnerVisible = true;
    },
    hideSpinner() {
      console.log('hide spinner');
      this.spinnerVisible = false;
    }

  },
};
</script>
