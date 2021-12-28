<template>
  <v-dialog v-model="dialogStatus" width="900px" :persistent="true">
    <v-card  class="elevation-0">
      <v-card-title>
        <span class="text-h5">{{ fromTitle }}</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12" sm="6" md="3">
              <v-text-field v-model="item.id" label="ID"></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="3">
              <v-text-field v-model="item.roleKey" label="角色标识"></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="3">
              <v-text-field v-model="item.roleName" label="角色名称"></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="3">
              <v-text-field v-model="item.status" label="角色状态"></v-text-field>
            </v-col>
          </v-row>

            <v-card class="elevation-0">
              <v-toolbar flat>
                <v-toolbar-title>选择资源</v-toolbar-title>
                <v-divider class="mx-10" inset vertical></v-divider>
              </v-toolbar>
              <v-divider/>
              <v-data-table

                  v-model="selected"
                  :headers="headers"
                  :items="desserts"
                  :single-select="singleSelect"
                  item-key="id"
                  show-select
                  class="elevation-1"
                  :height="550"
              >
              </v-data-table>
            </v-card>

        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="handleCancel">取消</v-btn>
        <v-btn color="primary" @click="handUpdateItem">保存</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import {ActionItem} from "@/utils/Mixin";
import API from "@/router/API";

export default {
  name: "SysResourcesAction",
  mixins: [ActionItem],
  props: ['showEditDialog', 'isEdit'],

  data() {
    return {
      singleSelect: false,
      selected: [],
      item: {
        id: null,
        createAt: null,
        createBy: null,
        delFlag: 'GET',
        roleKey: null,
        roleName: null,
        rolesResources: [],
        status: null,
      },
      //分页显示数据选项
      totalDesserts: 0, //列表总数
      desserts: [], // 数据
      loading: true, //加载中
      //表头
      headers: [
        {
          text: 'ID',
          align: 'start',
          sortable: false,
          value: 'id',
        },
        {text: '名称', value: 'sysResources.resName', align: 'center'},
        {text: '路径', value: 'sysResources.resPath', align: 'center'},
        {text: '图标', value: 'sysResources.resIcon'},
        {text: 'HTTP方法', value: 'sysResources.httpMethod'},
        {text: '类型', value: 'sysResources.resType', align: 'center'},
      ],
    }
  },
  watch: {
    dialog: {
      immediate: false,
      handler: function () {
        this.dialogStatus = this.dialog
      },
    },
    actionItem: {
      immediate: false,
      handler: function () {
        console.log("=============")
        this.item = this.actionItem
        console.log(this.item)
        this.desserts = this.item.rolesResources
        this.totalDesserts = this.item.rolesResources.length
      },
    },
  },
  computed: {
    fromTitle() {
      return this.isEdit ? "修改角色" : "添加角色"
    }
  },
  mounted() {


  },

  methods: {
    handUpdateItem(){
      if(this.isEdit){
        this.handleEditItem()
      } else {
        this.handleCreateItem()
      }
    },
    handleEditItem() {
      this.$http.post(API.RESOURCES_UPDATE + this.item.id, this.item).then(response => {
        console.log(response)
      })
    },
    handleCreateItem() {
      this.$http.post(API.RESOURCES_SAVE, this.item).then(response => {
        console.log(response)
      })
    },
    handleCancel() {
      this.showEditDialog(false)
    }
  }

}
</script>