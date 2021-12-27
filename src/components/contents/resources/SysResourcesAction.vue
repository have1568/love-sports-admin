<template>
  <v-dialog v-model="dialogStatus" max-width="900px" :persistent="true">
    <v-card>
      <v-card-title>
        <span class="text-h5">{{ fromTitle }}</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12" sm="6" md="4">
              <v-text-field v-model="item.resName" label="名称"></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-text-field v-model="item.resPath" label="路径"></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-text-field v-model="item.resIcon" label="图标"></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-select
                  v-model="item.httpMethod"
                  :items="['GET','POST']"
                  label="HTTP方法"
              ></v-select>
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-select
                  label="资源类型"
                  v-model="item.resType"
                  :items="['API','MENU']"
              ></v-select>
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-select
                  label="是否为根菜单"
                  v-model="item.root"
                  :items="rootItem"
              ></v-select>
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-text-field type="number" :hide-spin-buttons="true" v-model="item.resSort" label="排序"></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-select
                  label="父资源"
                  v-model="item.parentId"
                  :items="parents"
              ></v-select>
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-select
                  label="所属应用"
                  v-model="item.clientId"
                  :items="clients"
              ></v-select>
            </v-col>
          </v-row>
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
      parents: [],
      clients: [],
      rootItem: [
        {text: "是", value: true},
        {text: "否", value: false},
      ],
      item: {
        resName: null,
        resPath: null,
        resIcon: null,
        httpMethod: 'GET',
        resType: null,
        resSort: null,
        parentId: null,
        root: false,
        clientId: null
      },
    }
  },
  computed: {
    fromTitle() {
      return this.isEdit ? "修改资源" : "添加资源"
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
        if (this.isEdit) {
          this.item = this.actionItem
        }
      },
    },
  },

  mounted() {
    this.getParents();
    this.getClients();
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

    getParents() {
      this.$http.get(API.RESOURCES_ALL).then(response => {
        console.log(response)
        this.parents = response.data.data
      })
    },

    getClients() {
      this.$http.get(API.CLIENT_ALL).then(response => {
        console.log(response)
        this.clients = response.data.data
      })
    },

    handleCancel() {
      this.showEditDialog(false)
    }
  }

}
</script>