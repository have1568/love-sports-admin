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
      <div v-for="(item, index) in resources" :key="index">

        <v-list-item
            :key="item.resName"
            :to="item.resPath"
            v-if="isShowItem(item)"
        >
          <v-list-item-icon>
            <v-icon>{{ item.resIcon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title v-text="item.resName"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-group
            v-else
            transition="fab-transition"
            :key="item.id"
            v-model="item.active"
            :prepend-icon="item.resIcon"
            no-action

        >
          <template v-slot:activator>
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
            <v-list-item-content>
              <v-list-item-title v-text="child.resName"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>
      </div>
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
  methods: {
    isShowItem(item) {
      return item.children < 1
    }
  },
  computed: {
    resources() {
      let resources = this.principal.resources;
      if (resources) {
        return resources.sort((a, b) => {
          return a.resSort - b.resSort;
        })
      }
      return [];

    }
  }
}
</script>