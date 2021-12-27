<template>
  <!-- 删除 dialog -->
  <v-dialog v-model="dialogStatus" max-width="500px">
    <v-card>
      <v-card-title class="text-h5">你确定要删除这个项目吗?</v-card-title>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="handleCancel">取消</v-btn>
        <v-btn color="blue darken-1" text @click="handleDeleteItem">确定</v-btn>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>

import {ActionItem} from "@/utils/Mixin";

export default {
  name: "SysResourceDelete",
  mixins: [ActionItem],
  beforeCreate() {
    //this.item = this.actionItem;
  },
  props: ['showDeleteDialog'],

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
    handleDeleteItem() {

    },
    handleCancel() {
      this.showDeleteDialog(false)
    }
  }

}

</script>