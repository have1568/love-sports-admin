import Vue from 'vue';
import '@mdi/font/css/materialdesignicons.css' 
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

// Translation provided by Vuetify (javascript)
import zhHans from 'vuetify/lib/locale/zh-Hans';

Vue.component('appvu', {
  methods: {
    changeLocale () {
      this.$vuetify.lang.current = 'sv'
    },
  },
})

export default new Vuetify({
  lang: {
    locales: { zhHans },
    current: 'zhHans',
  },
  icons: {
    iconfont: 'mdi', // 默认值 - 仅用于展示目的
  },
})
