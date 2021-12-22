<template>
    <v-data-table
        :headers="headers"
        :items="desserts"
        :search="search"
        :options.sync="options"
        :server-items-length="totalDesserts"
        :loading="loading"
        class="elevation-1"
    >
        <template v-slot:top>
            <v-toolbar flat>
                <v-toolbar-title>资源管理</v-toolbar-title>
                <v-divider class="mx-10" inset vertical></v-divider>
                <v-text-field
                    v-model="search"
                    append-icon="mdi-magnify"
                    label="查找"
                    single-line
                    hide-details
                ></v-text-field>
                <v-spacer></v-spacer>

                <!-- 修改增加 dialog -->
                <v-dialog v-model="dialog" max-width="900px">
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">添加资源</v-btn>
                    </template>
                    <v-card>
                        <v-card-title>
                            <span class="text-h5">{{ formTitle }}</span>
                        </v-card-title>
                        <v-card-text>
                            <v-container>
                                <v-row>
                                    <v-col cols="12" sm="6" md="4">
                                        <v-text-field v-model="editedItem.resName" label="名称"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="4">
                                        <v-text-field v-model="editedItem.resPath" label="路径"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="4">
                                        <v-text-field v-model="editedItem.resIcon" label="图标"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="4">
                                        <v-text-field
                                            v-model="editedItem.httpMethod"
                                            label="HTTP方法"
                                        ></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="4">
                                        <v-text-field v-model="editedItem.resType" label="类型"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="4">
                                        <v-text-field v-model="editedItem.resSort" label="排序"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="4">
                                        <v-text-field v-model="editedItem.parentId" label="父资源"></v-text-field>
                                    </v-col>
                                </v-row>
                            </v-container>
                        </v-card-text>

                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="blue darken-1" text @click="close">取消</v-btn>
                            <v-btn color="blue darken-1" text @click="save">保存</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
                <!-- 删除 dialog -->
                <v-dialog v-model="dialogDelete" max-width="500px">
                    <v-card>
                        <v-card-title class="text-h5">Are you sure you want to delete this item?</v-card-title>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
                            <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
                            <v-spacer></v-spacer>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-toolbar>
        </template>
        <!-- 操作列 -->
        <template v-slot:item.actions="{ item }">
            <v-icon small class="mr-2" @click="edit(item)">mdi-pencil</v-icon>
            <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
        </template>
        <template v-slot:no-data>
            <v-btn color="primary" @click="initialize">重置</v-btn>
        </template>
    </v-data-table>
</template>

<script>
export default {
    data: () => ({
        search: '',
        dialog: false,
        dialogDelete: false,

        //分页显示数据选项
        totalDesserts: 0, //列表总数 
        desserts: [], // 数据
        loading: true, //加载中
        // {
        //   page: number,
        //   itemsPerPage: number,
        //   sortBy: string[],
        //   sortDesc: boolean[],
        //   groupBy: string[],
        //   groupDesc: boolean[],
        //   multiSort: boolean,
        //   mustSort: boolean
        // }
        //分页排序配置
        options: {
            page: 1,
            itemsPerPage: 10,
            multiSort: false, //暂时禁用多属性排序
            sortBy: ["resSort"],
            sortDesc: [true]
        },
        headers: [
            {
                text: 'ID',
                align: 'start',
                sortable: false,
                value: 'id',
            },
            { text: '名称', value: 'resName' },
            { text: '路径', value: 'resPath' },
            { text: '图标', value: 'resIcon' },
            { text: 'HTTP方法', value: 'httpMethod' },
            { text: '类型', value: 'resType' },
            { text: '排序', value: 'resSort', sortable: true },
            { text: '操作', value: 'actions', sortable: false },

        ],
        editedIndex: -1,
        editedItem: {
            resName: '',
            resPath: 0,
            resIcon: 0,
            httpMethod: 0,
            resType: 0,
            resSort: 0,
            parentId: 0
        },
        defaultItem: {
            name: '',
            calories: 0,
            fat: 0,
            carbs: 0,
            protein: 0,
        },
    }),

    computed: {
        formTitle() {
            return this.editedIndex === -1 ? '添加资源' : '修改资源'
        },
    },
    created() {
        this.initialize()
    },
    watch: {

        //Vue官方文档 demo
        // 如果 `question` 发生改变，这个函数就会运行
        // question: function (newQuestion, oldQuestion) {
        //     this.answer = 'Waiting for you to stop typing...'
        //     this.debouncedGetAnswer()
        // },
        // Vuetify Demo
        // options: {
        //     handler() {
        //         this.getDataFromApi()
        //     },
        //     deep: true,
        // },
        options: {
            deep: true,
            handler: function (val, oldVal) {
                this.initialize()
            },
        },
        dialog(val) {
            val || this.close()
        },
        dialogDelete(val) {
            val || this.closeDelete()
        },
    },
    methods: {
        initialize() {
            this.loading = true;
            let requestParam = {
                page: this.options.page - 1,
                size: this.options.itemsPerPage,
                sort: this.options.sortBy[0] + "," + (this.options.sortDesc[0] ? "DESC" : "ASC"),
            }
            //解决重复点击的BUG,参照官方的实例修改
            if(this.options.sortBy.length ==0){
                this.loading = false;
                return;
            }
            this.$axios.get("/love_sports/love-sports-auth/api/resources/list", { params: requestParam })
                .then((response) => {
                    let res = response.data.data
                    this.desserts = res.content
                    this.totalDesserts = res.totalElements
                    this.loading = false;
                })
        },

        edit(item) {
            this.editedIndex = this.desserts.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.dialog = true
        },

        deleteItem(item) {
            this.editedIndex = this.desserts.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.dialogDelete = true
        },

        deleteItemConfirm() {
            this.desserts.splice(this.editedIndex, 1)
            this.closeDelete()
        },

        close() {
            this.dialog = false
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem)
                this.editedIndex = -1
            })
        },

        closeDelete() {
            this.dialogDelete = false
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem)
                this.editedIndex = -1
            })
        },

        save() {
            if (this.editedIndex > -1) {
                Object.assign(this.desserts[this.editedIndex], this.editedItem)
            } else {
                this.desserts.push(this.editedItem)
            }
            this.close()
        },
    },
}
</script>