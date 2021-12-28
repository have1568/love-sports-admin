<template>
  <v-col cols="12">
    <v-card tile>
      <v-toolbar flat>
        <v-toolbar-title>角色管理</v-toolbar-title>
        <v-divider class="mx-10" inset vertical></v-divider>
        <v-text-field
            v-model="search.key.text"
            text
            solo
            flat
            :prepend-icon="showFilter ? 'mdi-filter-variant-plus' : 'mdi-filter-variant'"
            append-icon="mdi-magnify"
            placeholder="搜索项关键字"
            hide-details
            clearable
            @keyup.enter="handleApplyFilter"
            @click:append="handleApplyFilter"
            @click:prepend="showFilter = !showFilter"
            @click:clear="handleClear"
        />
        <v-btn icon @click="initialize">
          <v-icon>mdi-refresh</v-icon>
        </v-btn>
        <v-btn icon @click="handleAction({},'create')">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-toolbar>
      <v-divider/>
      <v-card color="white" v-show="showFilter" flat class="grey lighten-4">
        <v-card-text>
          <v-row>
            <v-col :cols="4">
              <v-autocomplete v-model="search.key.field"
                              :items="[{text:'名称',value:'resName'},{text:'路径',value:'resPath'}]" label="搜索项"/>
            </v-col>
            <v-col :cols="4">
              <v-autocomplete v-model="search.resType" :items="[{text:'菜单',value:'MENU'},{text:'API',value:'API'}]"
                              label="资源类型"/>
            </v-col>
            <v-col :cols="4">
              <v-autocomplete v-model="search.httpMethod" :items="['GET','POST']" label="HTTP方法"/>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn tile color="secondary" @click="handleResetFilter">清空</v-btn>
          <v-btn tile color="info" @click="handleApplyFilter">应用</v-btn>
        </v-card-actions>
      </v-card>
      <v-data-table
          :headers="headers"
          :items="desserts"
          :search="search.key.text"
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
          <v-icon class="mr-2" @click="handleAction(item,'edit')">mdi-pencil</v-icon>
          <v-icon @click="handleAction(item,'delete')">mdi-delete</v-icon>
        </template>
        <template v-slot:no-data>
          <v-btn color="primary" @click="initialize">无数据</v-btn>
        </template>
      </v-data-table>
    </v-card>
    <!-- 修改/创建/删除 dialog -->
    <SysRoleAction :actionItem="actionItem"
                        :is-edit="isEdit"
                        :showEditDialog="showEditDialog"
                        :dialog="dialogEdit"></SysRoleAction>
  </v-col>
</template>

<script>

import API from '@/router/API'

import SysRoleAction from "@/components/contents/role/SysRoleAction";

export default {
  components: {
    SysRoleAction,
  },
  data() {
    return {
      showFilter: false,
      filter: {
        'filter[name]': null,
        'filter[project_id]': null,
        'filter[status]': ['MENU', 'API'],
      },
      //CRUD 需要的数据
      actionItem: {},
      isEdit: false,
      dialogEdit: false,
      dialogShow: false,
      dialogCreate: false,
      dialogDelete: false,

      //搜索需要的数据
      search: {
        key: {
          text: "",
          field: ""
        },
        resType: "",
        httpMethod: ""

      },
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
          value: 'id',
        },
        {text: '角色标识', value: 'roleKey', align: 'center'},
        {text: '角色名称', value: 'roleName', align: 'center'},
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
      this.axios.get(API.ROLE_LIST, {params: requestParam})
          .then((response) => {
            let res = response.data.data
            this.desserts = res.content
            this.totalDesserts = res.totalElements
            this.loading = false;
          })
    },
    handleApplyFilter() {
      // this.filter.t = Date.now()
      // this.$router.replace({
      //   path: this.$route.path,
      //   query: this.filter,
      // })
    },
    handleResetFilter() {
      this.search.resType = null
      this.search.httpMethod = null
      this.search.key = {}

    },
    handleClear() {

    },

    showEditDialog(val) {
      this.dialogEdit = val;

    },
    handleAction(actionItem, actionType) {
      //赋值当前操作的列的数据
      this.actionItem = actionItem;

      //将所有的弹窗关闭
      this.dialogCreate = false;
      this.dialogDelete = false;
      this.dialogEdit = false;
      this.dialogShow = false;

      //打开对应操作的弹窗
      switch (actionType) {
        case "create":
          this.dialogEdit = true;
          this.isEdit = false;
          break;
        case "delete":
          this.dialogDelete = true;
          break;
        case "edit":
          this.dialogEdit = true;
          this.isEdit = true;
          break;
        case "show":
          this.dialogShow = true;
          break;
      }
    },
  },
}
</script>