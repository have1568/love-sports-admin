<template>
  <v-app-bar elevation="0" app dark color="blue">
    <v-app-bar-nav-icon
        transition="fab-transition"
        @click.stop="toggleDrawer(!drawer)"
    >
      <v-icon>{{ toggleNavIcon }}</v-icon>
    </v-app-bar-nav-icon>
    <v-btn icon>
      <v-icon>mdi-home</v-icon>
    </v-btn>
<!--    <v-breadcrumbs large :items="breadcrumbs"></v-breadcrumbs>-->
    <v-spacer></v-spacer>
    <v-btn icon>
      <v-icon>mdi-magnify</v-icon>
    </v-btn>
    <v-btn icon>
      <v-icon>mdi-heart</v-icon>
    </v-btn>
    <v-menu offset-y origin="center center" transition="scale-transition">
      <template v-slot:activator="{ on }">
        <v-btn slot="activator" icon large text v-on="on">
          <v-avatar size="30px">
            <v-img src="https://randomuser.me/api/portraits/women/85.jpg"></v-img>
          </v-avatar>
        </v-btn>
      </template>
      <v-list class="pa-0">
        <v-list-item
            v-for="(item, index) in profileMenus"
            :key="index"
            :to="!item.href ? { name: item.name } : null"
            :href="item.href"
            :disabled="item.disabled"
            :target="item.target"
            @click="item.click"
        >
          <v-list-item-action v-if="item.icon">
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>
<script>

import {mapMutations, mapState} from 'vuex'

export default {
  name: "AppTopBar",
  data(){
    return {
      profileMenus: [
        {
          icon: 'mdi-account',
          href: '#',
          title: 'Profile',
          click: this.handleProfile,
        },
        {
          icon: 'mdi-cog',
          href: '#',
          title: 'Settings',
          click: this.handleSetting,
        },
        {
          icon: 'mdi-power',
          href: '#',
          title: 'Logout',
          click: this.handleLoginOut,
        },
      ],
    }
  },
  computed: {
    ...mapState("AppSettingAbout",["drawer"]),
    toggleNavIcon() {
      return !this.drawer
          ? "mdi-format-indent-increase"
          : "mdi-format-indent-decrease";
    },
  },
  methods: {
    ...mapMutations('AppSettingAbout', ['toggleDrawer']),
    handleLoginOut() {

    },
    handleSetting() {
    },
    handleProfile() {
    },

  },
};
</script>