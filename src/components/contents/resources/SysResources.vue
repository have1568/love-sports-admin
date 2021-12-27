<template>
  <v-col cols="12">
    <v-card tile>
      <v-toolbar flat>
        <v-toolbar-title>资源管理</v-toolbar-title>
        <v-divider class="mx-10" inset vertical></v-divider>
        <v-text-field
            v-model="filter['filter[name]']"
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
        <v-btn icon @click="showCreateDialog(true)">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-toolbar>
      <v-divider/>
      <v-card v-show="showFilter" flat class="grey lighten-4">
        <v-card-text>
          <v-row>
            <v-col :cols="4">
              <v-autocomplete v-model="filter['filter[project_id]']" :items="['名称','路径']" label="搜索项"/>
            </v-col>
            <v-col :cols="4">
              <v-autocomplete v-model="filter['filter[status]']" :items="['菜单','API']" label="资源类型"/>
            </v-col>
            <v-col :cols="4">
              <v-autocomplete v-model="filter['filter[status]']" :items="['GET','POST']" label="HTTP方法"/>
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
          :search="search"
          :options.sync="pageOptions"
          :server-items-length="totalDesserts"
          :loading="loading"
          class="elevation-1"
      >
        <template v-slot:item.resIcon={item}>
          <v-icon>{{ item.resIcon }}</v-icon>
        </template>
        <!-- 操作列 -->
        <template v-slot:item.actions={item}>
          <v-icon class="mr-2" @click="handleAction(item,'edit')">mdi-pencil</v-icon>
          <v-icon class="mr-2" @click="handleAction(item,'show')">mdi-information-outline</v-icon>
          <v-icon @click="handleAction(item,'delete')">mdi-delete</v-icon>
        </template>
        <template v-slot:no-data>
          <v-btn color="primary" @click="initialize">无数据</v-btn>
        </template>
      </v-data-table>
    </v-card>
    <!-- 创建 dialog -->
    <SysResourceCreate :showCreateDialog="showCreateDialog" :dialog="dialogCreate"></SysResourceCreate>
    <!-- 删除 dialog -->
    <SysResourceDelete :actionItem="actionItem"
                       :showDeleteDialog="showDeleteDialog"
                       :dialog="dialogDelete"></SysResourceDelete>
    <!-- 修改 dialog -->
    <SysResourceEdit :actionItem="actionItem"
                     :showEditDialog="showEditDialog"
                     :dialog="dialogEdit"></SysResourceEdit>
    <!-- 查看 dialog -->
    <SysResourceShow :actionItem="actionItem"
                     :showDialog="showDialog"
                     :dialog="dialogShow"></SysResourceShow>
  </v-col>
</template>

<script>

import API from '@/router/API'
import SysResourceCreate from "@/components/contents/resources/SysResourceCreate";
import SysResourceDelete from "@/components/contents/resources/SysResourceDelete";
import SysResourceEdit from "@/components/contents/resources/SysResourceEdit";
import SysResourceShow from "@/components/contents/resources/SysResourceShow";

export default {
  components: {
    SysResourceCreate,
    SysResourceDelete,
    SysResourceEdit,
    SysResourceShow
  },
  data() {
    return {
      showFilter: true,
      filter: {
        'filter[name]': null,
        'filter[project_id]': null,
        'filter[status]': ['MENU', 'API'],
      },
      actionItem: {},
      dialogEdit: false,
      dialogShow: false,
      dialogCreate: false,
      dialogDelete: false,

      search: '',
      //分页显示数据选项
      totalDesserts: 0, //列表总数
      desserts: [], // 数据
      loading: true, //加载中
      // {
      //   page: number,
      //   itemsPerPage: number,
      //   sortBy: string[],
      //   sortDesc: boolean[],
      //   groupBy: string[],
      //   groupDesc: boolean[],
      //   multiSort: boolean,
      //   mustSort: boolean
      // }
      //分页排序配置
      pageOptions: {
        page: 1,
        itemsPerPage: 10,
        sortBy: ["resSort"],
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
        {text: '名称', value: 'resName'},
        {text: '路径', value: 'resPath'},
        {text: '图标', value: 'resIcon'},
        {text: 'HTTP方法', value: 'httpMethod'},
        {text: '类型', value: 'resType'},
        {text: '排序', value: 'resSort', sortable: true},
        {text: '操作', value: 'actions', sortable: false},

      ],
    }
  },

  watch: {
    //Vue官方文档 demo
    // 如果 `question` 发生改变，这个函数就会运行
    // question: function (newQuestion, oldQuestion) {
    //     this.answer = 'Waiting for you to stop typing...'
    //     this.debouncedGetAnswer()
    // },
    // Vuetify Demo
    // options: {
    //     handler() {
    //         this.getDataFromApi()
    //     },
    //     deep: true,
    // },
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
      this.axios.get(API.RESOURCES_LIST, {params: requestParam})
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
      this.filter = {
        page: 1,
        'filter[name]': null,
        'filter[status]': null,
      }
    },
    handleClear() {

    },

    showCreateDialog(val) {
      this.dialogCreate = val;

    },

    showDeleteDialog(val) {
      this.dialogDelete = val;

    },
    showEditDialog(val) {
      this.dialogEdit = val;

    },

    showDialog(val) {
      this.dialogShow = val;
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
          this.dialogCreate = true;
          break;
        case "delete":
          this.dialogDelete = true;
          break;
        case "edit":
          this.dialogEdit = true;
          break;
        case "show":
          this.dialogShow = true;
          break;
      }
    },
  },
}
</script>