<template>
  <v-col cols="12">
    <v-card tile class="elevation-0">
      <v-toolbar flat>
        <v-toolbar-title>资源管理</v-toolbar-title>
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
        <v-btn icon @click="createItem({})">
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
          <v-icon class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
        </template>
        <template v-slot:no-data>
          <v-btn color="primary" @click="initialize">无数据重置</v-btn>
        </template>
      </v-data-table>
    </v-card>
    <!-- 修改/创建/删除 dialog -->
    <SysResourcesAction/>
  </v-col>
</template>
<script>

import API from '@/router/API'
import {mapMutations, mapState} from 'vuex'

export default {
  components: {
    SysResourcesAction: () => import('@/components/contents/resources/SysResourcesAction'),
  },
  computed: {
    ...mapState("ItemActionAbout", ['actionItem', 'showDialog'])
  },
  data() {
    return {
      showFilter: false,
      //CRUD 需要的数据
      //搜索需要的数据
      search: {
        key: {
          text: null,
          field: 'resName'
        },
        resType: null,
        httpMethod: null

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
        {text: '名称', value: 'resName', align: 'center'},
        {text: '路径', value: 'resPath', align: 'center'},
        {text: '图标', value: 'resIcon'},
        {text: 'HTTP方法', value: 'httpMethod'},
        {text: '类型', value: 'resType'},
        {text: '排序', value: 'resSort'},
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
      if (this.search.key.field && this.search.key.text) {
        requestParam[this.search.key.field] = this.search.key.text;
      }
      if (this.search.resType) {
        requestParam.resType = this.search.resType;
      }
      if (this.search.httpMethod) {
        requestParam.httpMethod = this.search.httpMethod;
      }
      //解决重复点击的BUG,参照官方的实例修改
      if (this.pageOptions.sortBy.length === 0) {
        this.loading = false;
        return;
      }
      this.axios.get(API.RESOURCES_LIST, {params: requestParam})
          .then((response) => {
            let res = response.data
            this.desserts = res.content
            this.totalDesserts = res.totalElements
            this.loading = false;
          })
    },
    handleApplyFilter() {
      if ((this.search.key.field && this.search.key.text) || this.search.resType || this.search.httpMethod) {
        this.initialize()
      }
    },
    handleResetFilter() {
      this.search.resType = null
      this.search.httpMethod = null
      this.search.key = {}
    },
    handleClear() {
      this.search.key.text = null
    },
  },
}
</script>