<template>
  <v-col cols="12">
    <v-card tile>
      <v-toolbar flat class="mt-5">
        <v-toolbar-title>应用管理</v-toolbar-title>
        <v-divider class="mx-16" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-btn icon @click="initialize">
          <v-icon>mdi-refresh</v-icon>
        </v-btn>
        <v-btn icon @click="createItem({})">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-toolbar>
      <v-divider/>
      <v-data-table
          :headers="headers"
          :items="desserts"
          :footer-props="{'items-per-page-options':[10,20,30]}"
          :options.sync="pageOptions"
          :server-items-length="totalDesserts"
          :loading="loading"
          class="elevation-1"
      >
        <!-- 操作列 -->
        <template v-slot:item.actions={item}>
          <v-icon class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
        </template>
        <template v-slot:no-data>
          <v-btn color="primary" @click="initialize">无数据</v-btn>
        </template>
      </v-data-table>
    </v-card>
    <!-- 修改/创建/删除 dialog -->
    <ClientAction/>
  </v-col>
</template>
<script>

import API from '@/router/API'
import {mapMutations, mapState} from 'vuex'

export default {
  components: {
    ClientAction: () => import('@/components/contents/client/ClientAction'),
  },
  computed: {
    ...mapState("ItemActionAbout", ['actionItem', 'showDialog'])
  },
  data() {
    return {
      expanded: [],
      //分页显示数据选项
      totalDesserts: 0, //列表总数
      desserts: [], // 数据
      loading: true, //加载中

      //分页排序配置
      pageOptions: {
        page: 1,
        itemsPerPage: 20,
        sortBy: ["createAt"],
        sortDesc: [true],
        multiSort: false, //暂时禁用多属性排序
        groupBy: [],
        groupDesc: [],
        mustSort: false

      },
      //表头
      headers: [
        {
          text: 'ID',
          align: 'start',
          sortable: false,
          value: 'clientId',
        },
        {text: '应用名称', value: 'clientName', align: 'center'},
        // {text: '密钥', value: 'clientSecret'},
        {text: '自动授权', value: 'autoApprove'},
        // {text: '授权类型', value: 'authorizedGrantTypes'},
        {text: '资源权限', value: 'authorities'},
        {text: '有效时间Token', value: 'accessTokenValidity'},
        {text: '有效时间RefreshToken', value: 'refreshTokenValidity'},
        {text: '重定向地址', value: 'webServerRedirectUri'},
        {text: '附加信息', value: 'additionalInformation'},
        {text: '资源域', value: 'scope'},
        {text: '操作', value: 'actions', align: 'center', sortable: false},

      ],
    }
  },
  watch: {
    pageOptions: {
      immediate: false,
      deep: true,  //深度监视，只要 options的属性变化了，就会被监视到
      handler: function (val, oldVal) {
        this.initialize()
      },
    },
  },
  methods: {
    ...mapMutations('ItemActionAbout', ['editItem', 'createItem', 'showItem']),
    initialize() {
      this.loading = true;
      let requestParam = {
        page: this.pageOptions.page - 1, //后端 page 是从0开始的
        size: this.pageOptions.itemsPerPage,
        sort: this.pageOptions.sortBy[0] + "," + (this.pageOptions.sortDesc[0] ? "DESC" : "ASC"),
      }
      //解决重复点击的BUG,参照官方的实例修改
      if (this.pageOptions.sortBy.length === 0) {
        this.loading = false;
        return;
      }
      this.axios.get(API.CLIENT_LIST, {params: requestParam})
          .then((response) => {
            let res = response.data
            this.desserts = res.content
            this.totalDesserts = res.totalElements
            this.loading = false;

          })
    },
  },
}
</script>
