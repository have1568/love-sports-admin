<template>
  <v-navigation-drawer
      v-model="drawer"
      :mini-variant.sync="mini"
      width="220"
      mobileBreakpoint="720"
      app
      elevation="0"
  >
    <v-toolbar color="primary" dark>
      <v-avatar size="30px">
        <v-btn icon>
          <v-icon color="pink">mdi-heart</v-icon>
        </v-btn>
      </v-avatar>
      <v-toolbar-title class="ml-0 pl-3">
        <span class="hidden-sm-and-down">SPORTS</span>
      </v-toolbar-title>
    </v-toolbar>

    <v-divider></v-divider>
    <v-list>
      <div v-for="(item, index) in resources" :key="index">
        <v-list-item
            color="primary"
            :key="item.resName"
            :to="item.resPath"
            v-if="isShowItem(item)"
            @click="toggleMiniDrawer(false)"
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
            @click="toggleMiniDrawer(false)"
        >
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title v-text="item.resName"></v-list-item-title>
            </v-list-item-content>
          </template>
          <v-list-item
              color="primary"
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
    <template #append>
      <div class="grey lighten-3">
        <v-btn block width="64" height="48" icon tile class="mx-auto" @click="toggleMiniDrawer(!mini)">
          <v-icon>{{ toggleMiniDrawerIcon }}</v-icon>
        </v-btn>
      </div>
    </template>
  </v-navigation-drawer>
</template>
<script>
import {mapMutations, mapState} from 'vuex'

export default {
  name: 'AppDrawer',
  methods: {
    ...mapMutations('AppSettingAbout', ['toggleMiniDrawer']),
    isShowItem(item) {
      return item == null || item.children < 1
    }
  },
  computed: {
    ...mapState("AppSettingAbout", ['mini']),
    ...mapState("SessionAbout", ["principal"]),
    toggleMiniDrawerIcon() {
      return this.mini
          ? "mdi-arrow-collapse-right"
          : "mdi-arrow-collapse-left";
    },

    drawer: {
      get() {
        return this.$store.state.AppSettingAbout.drawer;
      },
      set() {

      }
    },
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