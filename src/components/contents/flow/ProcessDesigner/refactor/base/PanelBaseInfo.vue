<template>
  <div class="panel-tab__content">
    <v-form @submit.native.prevent>
      <v-text-field
        v-model="elementBaseInfo.id"
        :disabled="idEditDisabled || elementBaseInfo.$type === 'bpmn:Process'"
        label="Id"
        @change="updateBaseInfo('id')"
      />
      <v-text-field
        v-model="elementBaseInfo.name"
        label="名称"
        @change="updateBaseInfo('name')"
      />
      <template v-if="elementBaseInfo.$type === 'bpmn:Process'">
        <v-text-field
          v-model="elementBaseInfo.versionTag"
          label="版本标签"
          @change="updateBaseInfo('versionTag')"
        />
        <v-switch
          v-model="elementBaseInfo.isExecutable"
          :label="'可执行：' + (elementBaseInfo.isExecutable ? '是' : '否')"
          @change="updateBaseInfo('isExecutable')"
        />
      </template>
    </v-form>
  </div>
</template>
<script>
export default {
  name: 'PanelBaseInfo',
  props: {
    businessObject: {
      type: Object,
      default: () => {
        return {}
      }
    },
    type: {
      type: String,
      default: ''
    },
    idEditDisabled: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      elementBaseInfo: {}
    }
  },
  watch: {
    businessObject: {
      immediate: false,
      handler: function(val) {
        if (val) {
          this.$nextTick(() => this.resetBaseInfo())
        }
      }
    }
  },
  beforeDestroy() {
    this.bpmnElement = null
  },
  methods: {
    resetBaseInfo() {
      this.bpmnElement = window?.bpmnInstances?.bpmnElement
      this.elementBaseInfo = JSON.parse(JSON.stringify(this.bpmnElement.businessObject))
    },
    updateBaseInfo(key) {
      const attrObj = Object.create(null)
      attrObj[key] = this.elementBaseInfo[key]
      if (key === 'id') {
        window.bpmnInstances.modeling.updateProperties(this.bpmnElement, {
          id: this.elementBaseInfo[key],
          di: { id: `${this.elementBaseInfo[key]}_di` }
        })
      } else {
        window.bpmnInstances.modeling.updateProperties(this.bpmnElement, attrObj)
      }
    }
  }
}
</script>
