<template>
  <v-navigation-drawer
      v-model="drawer"
      :mini-variant.sync="mini"
      mini-variant-width="80"
      width="240"
      mobileBreakpoint="720"
      app
      elevation="0"
  >
    <v-list class="pb-0">
      <v-list-item>
        <v-list-item-avatar>
          <v-img src="https://randomuser.me/api/portraits/women/85.jpg"></v-img>
        </v-list-item-avatar>
      </v-list-item>
      <v-list-item link>
        <v-list-item-content>
          <v-list-item-title class="text-h6">{{ principal.nickName }}</v-list-item-title>
          <v-list-item-subtitle>{{ principal.username }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <v-divider></v-divider>
    <v-list>
      <v-list-group
          v-show="item.resType == 'MENU'"
          transition="fab-transition"
          v-for="item in resources"
          :key="item.id"
          v-model="item.active"
          :prepend-icon="item.resIcon"
          no-action
      >
        <template v-slot:activator v-if="item.resType == 'MENU'">
          <v-list-item-content>
            <v-list-item-title v-text="item.resName"></v-list-item-title>
          </v-list-item-content>
        </template>
        <v-list-item
            v-for="child in item.children"
            :key="child.resName"
            :to="child.resPath"
            class="pl-7"
        >
          <v-list-item-icon>
            <v-icon>{{ child.resIcon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content v-if="child.resType == 'MENU'">
            <v-list-item-title v-text="child.resName"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-group>
    </v-list>
  </v-navigation-drawer>
</template>
<script>
export default {
  name: 'AppDrawer',
  props: {
    enableMini: {
      type: Boolean,
      default: () => true,
    },
    menus: {
      type: Array,
    },
    principal: {},
  },
  watch: {
    enableMini: function () {
      this.mini = this.enableMini
    },
  },
  data() {
    return {
      mini: true,
      drawer: true
    }
  },
  computed: {
    resources() {
      let resources = this.principal.resources;
      return resources.sort((a, b) => {
        return a.resSort - b.resSort;
      })
    }
  }
}
</script>
<style>
</style>