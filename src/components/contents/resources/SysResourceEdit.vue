<template>
  <v-dialog v-model="dialogStatus" max-width="900px">
    <v-card>
      <v-card-title>
        <span class="text-h5">修改资源</span>
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
              <v-text-field
                  v-model="item.httpMethod"
                  label="HTTP方法"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-text-field v-model="item.resType" label="类型"></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-text-field v-model="item.resSort" label="排序"></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-text-field v-model="item.parentId" label="父资源"></v-text-field>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="handleCancel">取消</v-btn>
        <v-btn color="blue darken-1" text @click="handleEditItem">保存</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import {ActionItem} from "@/utils/Mixin";

export default {
  name: "SysResourceEdit",
  mixins: [ActionItem],
  props:['showEditDialog'],

  data() {
    return {
      item: {
        resName: null,
        resPath: null,
        resIcon: null,
        httpMethod: null,
        resType: null,
        resSort: null,
        parentId: null
      },
    }
  },

  methods: {
    handleEditItem() {

    },
    handleCancel(){
      this.showEditDialog(false)
    }
  }

}
</script>