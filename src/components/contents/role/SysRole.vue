<template>
  <v-col cols="12">
    <v-card tile>
      <v-toolbar flat>
        <v-toolbar-title>角色管理</v-toolbar-title>
        <v-divider class="mx-10" inset vertical></v-divider>
        <v-text-field
            v-model="searchRoleName"
            text
            solo
            flat
            :prepend-icon="'mdi-filter-variant'"
            append-icon="mdi-magnify"
            placeholder="输入名称"
            hide-details
            clearable
            @keyup.enter="searchRoles"
            @click:clear="handleClear"
        />
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
          :footer-props="{'items-per-page-options':[10,20,50]}"
          :options.sync="pageOptions"
          :server-items-length="totalDesserts"
          :loading="loading"
          class="elevation-1"
      >
        <!--  图标插槽   -->
        <template v-slot:item.resIcon={item}>
          <v-icon>{{ item.resIcon }}</v-icon>
        </template>
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
    <SysRoleAction/>

  </v-col>
</template>

<script>

import API from '@/router/API'
import {mapMutations, mapState} from 'vuex'

export default {
  components: {
    SysRoleAction: () => import('@/components/contents/role/SysRoleAction'),
  },
  computed: {
    ...mapState("ItemActionAbout", ['actionItem', 'showDialog'])
  },
  data() {
    return {
      //分页显示数据选项
      totalDesserts: 0, //列表总数
      desserts: [], // 数据
      loading: true, //加载中

      searchRoleName: "",

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
          value: 'id',
        },
        {text: '角色标识', value: 'roleKey', align: 'center'},
        {text: '角色名称', value: 'roleName', align: 'center'},
        {text: '角色等级', value: 'roleLevel', align: 'center'},
        {text: '角色状态', value: 'status'},
        {text: '创建时间', value: 'createAt', align: 'center'},
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
      if (this.searchRoleName) {
        requestParam.roleName = this.searchRoleName;
      }
      //解决重复点击的BUG,参照官方的实例修改
      if (this.pageOptions.sortBy.length === 0) {
        this.loading = false;
        return;
      }
      this.axios.get(API.ROLE_LIST, {params: requestParam})
          .then((response) => {
            let res = response.data
            this.desserts = res.content
            this.totalDesserts = res.totalElements
            this.loading = false;
          }).catch(error => {
        this.loading = false;
      })
    },
    searchRoles() {
      if (this.searchRoleName) {
        this.initialize();
      }
    },
    handleClear() {
      this.searchRoleName = null;
    },
  },
}
</script>