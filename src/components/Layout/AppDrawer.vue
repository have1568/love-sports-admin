<template>
    <v-navigation-drawer
        dark
        color="black"
        v-model="drawer"
        :mini-variant.sync="enableMini"
        mini-variant-width="80"
        width="240"
        mobileBreakpoint="720"
        app
    >
        <v-list>
            <v-list-item class="px-2">
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
                v-for="item in principal.resources"
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
                <v-list-item v-for="child in item.children" :key="child.resName" :to="child.resPath">
                    <v-list-item-icon><v-icon>{{ child.resIcon }}</v-icon></v-list-item-icon>
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
            default: () => false,
        },
        menus: {
            type: Array,
        },
        principal: {},
        prefix: {
            type: String,
            default: () => "",
        },
    },
    data: () => ({
        drawer: true,

    }),
}
</script>
<style>
</style>