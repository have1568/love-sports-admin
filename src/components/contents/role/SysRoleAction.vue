<template>
  <v-dialog v-model="showDialog" width="900px" :persistent="true">
    <v-card class="elevation-0">
      <v-card-title>
        <span class="text-h5">{{ fromTitle }}</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12" sm="6" md="3">
              <v-text-field disabled v-model="item.id" label="ID"></v-text-field>
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

          <v-card class="elevation-1 overflow-y-auto overflow-x-hidden pa-6" height="600">
            <v-row>
              <v-col cols="8">
                <v-treeview
                    dense
                    v-model="selection"
                    :items="resourcesTree"
                    :item-key="'id'"
                    :item-text="'resName'"
                    selectable
                    return-object
                >
                  <template v-slot:prepend="{ item }">
                    <v-icon>
                      {{ item.resIcon }}
                    </v-icon>
                  </template>
                  <template v-slot:append="{ item }">
                    <v-list-item>
                      <v-list-item-content>
                        {{ item.resPath }}
                      </v-list-item-content>
                    </v-list-item>
                  </template>
                </v-treeview>
              </v-col>
              <v-divider vertical></v-divider>
              <v-col cols="4">
                <template v-if="!selection||!selection.length">
                  没有选择资源
                </template>
                <template v-else>
                  <div v-for="node in selection" :key="node.id">
                    {{ node.resName }}
                  </div>
                </template>
              </v-col>
            </v-row>
          </v-card>

        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="cancelItemAction()">取消</v-btn>
        <v-btn color="primary" @click="handUpdateItem">保存</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import {mapMutations, mapState} from 'vuex'
import API from "@/router/API";

export default {
  name: "SysRoleAction",
  data() {
    return {
      hasGetAllowTree: false,
      item: {
        "id": null,
        "roleKey": "ROLE_",
        "roleLevel": 0,
        "roleName": "",
        "resources": [],
        "status":'ACTIVE'
      },
      selection: [{
        "id": 0,
        "parentId": 0,
        "resIcon": "",
        "resName": ""
      }
      ],
      resourcesTree: [],
    }
  },
  //监测打开弹窗
  watch: {
    actionItem: {
      deep: true,
      handler: function () {
        this.handRequiredActionData()
      },
    },
  },
  computed: {
    ...mapState('ItemActionAbout', ['showDialog', 'isEdit', 'actionItem', 'actionType']),
    //获取保存的 principal 用户认证信息
    ...mapState('SessionAbout', ['principal']),
    fromTitle() {
      return this.isEdit ? "修改角色" : "添加角色"
    }
  },
  mounted() {
    this.$http.get(API.RESOURCES_ALL_TREE, {params: {userId: this.principal.id}}).then(response => {
      this.resourcesTree = response.data
      this.selection = this.actionItem.resources
    })
  },
  methods: {
    ...mapMutations('ItemActionAbout', ['cancelItemAction']),
    handUpdateItem() {
      if (this.isEdit) {
        this.handleEditItem()
      } else {
        this.handleCreateItem()
      }
      this.cancelItemAction({})
    },
    handleEditItem() {
      this.item.resources = this.selection
      this.$http.post(API.ROLE_UPDATE + this.item.id, this.item).then(response => {
      })
    },
    handleCreateItem() {
      this.item.resources = this.selection
      this.$http.post(API.ROLE_SAVE, this.item).then(response => {
      })
    },

    handRequiredActionData() {
      // 新增 CREATE
      // 快速新增 CLONE
      // 删除 DELETE
      // 编辑 EDIT
      // 查看 SHOW
      switch (this.actionType) {
        case 'CREATE':
          break;
        case 'CLONE':
          console.log("CLONE")
          this.item = this.actionItem
          this.item.id = null
          this.selection = this.actionItem.resources
          break;
        case 'DELETE':
          console.log("DELETE")
          break;
        case 'EDIT':
          console.log("EDIT")
          this.item = this.actionItem
          this.selection = this.actionItem.resources
          break;
        case 'SHOW':
          console.log("SHOW")
          break;
        default:
      }
    }
  }

}
</script>