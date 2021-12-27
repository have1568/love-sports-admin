export const ActionItem = {
    props: {
        dialog: {
            type: Boolean,
            default: false
        },
        showDialog:{
          type: Object,
        },
        actionItem: {
            type: Object,
        }
    },

    watch: {
        dialog: {
            immediate: false,
            handler: function () {
                this.dialogStatus = this.dialog
            },
        },
        actionItem: {
            immediate: false,
            handler: function () {
                this.item = this.actionItem
            },
        },
    },
    data() {
        return {
            dialogStatus: this.dialog
        }
    },
}