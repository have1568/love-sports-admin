<template>
  <v-dialog v-model="showDialog" max-width="900px" :persistent="true">
    <v-card>
      <v-card-title>
        <span class="text-h5">{{ fromTitle }}</span>
      </v-card-title>
      <v-card-text>
<!--        <v-container>-->
<!--          <v-row>-->
<!--            <v-col cols="12" sm="6" md="4">-->
<!--              <v-text-field v-model="item.resName" label="名称"></v-text-field>-->
<!--            </v-col>-->
<!--            <v-col cols="12" sm="6" md="4">-->
<!--              <v-text-field v-model="item.resPath" label="路径"></v-text-field>-->
<!--            </v-col>-->
<!--            <v-col cols="12" sm="6" md="4">-->
<!--              <v-text-field v-model="item.resIcon" label="图标"></v-text-field>-->
<!--            </v-col>-->
<!--            <v-col cols="12" sm="6" md="4">-->
<!--              <v-select-->
<!--                  v-model="item.httpMethod"-->
<!--                  :items="['GET','POST']"-->
<!--                  label="HTTP方法"-->
<!--              ></v-select>-->
<!--            </v-col>-->
<!--            <v-col cols="12" sm="6" md="4">-->
<!--              <v-select-->
<!--                  label="资源类型"-->
<!--                  v-model="item.resType"-->
<!--                  :items="['API','MENU']"-->
<!--              ></v-select>-->
<!--            </v-col>-->
<!--            <v-col cols="12" sm="6" md="4">-->
<!--              <v-select-->
<!--                  label="是否为根菜单"-->
<!--                  v-model="item.root"-->
<!--                  :items="rootItem"-->
<!--              ></v-select>-->
<!--            </v-col>-->
<!--            <v-col cols="12" sm="6" md="4">-->
<!--              <v-text-field type="number" :hide-spin-buttons="true" v-model="item.resSort" label="排序"></v-text-field>-->
<!--            </v-col>-->
<!--            <v-col cols="12" sm="6" md="4">-->
<!--              <v-select-->
<!--                  label="父资源"-->
<!--                  v-model="item.parentId"-->
<!--                  :items="parents"-->
<!--                  :item-text="'resName'"-->
<!--                  :item-value="'id'"-->
<!--                  @focus="getParents"-->
<!--              >-->
<!--              </v-select>-->
<!--           -->
<!--          </v-row>-->
<!--        </v-container>-->
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="cancelItemAction">取消</v-btn>
        <v-btn color="primary" @click="handUpdateItem">保存</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import API from "@/router/API";
import {mapMutations, mapState} from 'vuex'

export default {
  name: "SysResourcesAction",
  data() {
    return {
      item: {
        "accessTokenValidity": 0,
        "additionalInformation": "",
        "authorities": "",
        "authorizedGrantTypes": "",
        "autoApprove": "",
        "clientId": "",
        "clientName": "",
        "clientSecret": "",
        "createTime": "",
        "refreshTokenValidity": 0,
        "resourceIds": "",
        "scope": "",
        "webServerRedirectUri": ""
      },
    }
  },
  computed: {
    ...mapState('ItemActionAbout', ['showDialog', 'isEdit', 'actionItem', 'actionType']),
    fromTitle() {
      return this.isEdit ? "修改资源" : "添加资源"
    }
  },
  watch: {
    actionItem: {
      immediate: false,
      handler: function () {
        if (this.isEdit) {
          this.item = this.actionItem
        }
      },
    },
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
      this.$http.post(API.CLIENT_UPDATE + this.item.id, this.item).then(response => {

      })
    },
    handleCreateItem() {
      this.$http.post(API.CLIENT_SAVE, this.item).then(response => {
      })
    },

  }

}
</script>