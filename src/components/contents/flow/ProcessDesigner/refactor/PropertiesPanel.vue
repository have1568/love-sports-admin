<template>
    <v-card elevation="0" class="d-flex flex-column mt-6 mr-6">
      <v-expansion-panels :value="0" accordion focusable hover mandatory>
        <v-expansion-panel>
          <v-expansion-panel-header>常规</v-expansion-panel-header>
          <v-expansion-panel-content>
            <panel-base-info :id-edit-disabled="idEditDisabled" :business-object="elementBusinessObject" :type="elementType" />
          </v-expansion-panel-content>
        </v-expansion-panel>
        <v-expansion-panel v-if="formVisible">
          <v-expansion-panel-header>表单</v-expansion-panel-header>
          <v-expansion-panel-content>
            <panel-form :id="elementId" :type="elementType" />
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-card>
</template>
<script>
import PanelBaseInfo from './base/PanelBaseInfo'
import PanelForm from './form/PanelForm'
export default {
  name: 'PropertiesPanel',
  components: {
    PanelBaseInfo,
    PanelForm
  },
  props: {
    bpmnModeler: {
      type: Object,
      default: () => {
        return {}
      }
    },
    prefix: {
      type: String,
      default: 'camunda'
    },
    width: {
      type: Number,
      default: 480
    },
    idEditDisabled: {
      type: Boolean,
      default: false
    }
  },
  provide() {
    return {
      prefix: this.prefix,
      width: this.width
    }
  },
  data() {
    return {
      activeTab: 'base',
      elementId: '',
      elementType: '',
      elementBusinessObject: {}, // 元素 businessObject 镜像，提供给需要做判断的组件使用
      conditionFormVisible: false, // 流转条件设置
      formVisible: false // 表单配置
    }
  },
  watch: {
    elementId: {
      handler() {
        this.activeTab = 'base'
      }
    }
  },
  created() {
    this.initModels()
  },
  methods: {
    initModels() {
      // 初始化 modeler 以及其他 moddle
      if (!this.bpmnModeler) {
        // 避免加载时 流程图 并未加载完成
        this.timer = setTimeout(() => this.initModels(), 10)
        return
      }
      if (this.timer) clearTimeout(this.timer)
      window.bpmnInstances = {
        modeler: this.bpmnModeler,
        modeling: this.bpmnModeler.get('modeling'),
        moddle: this.bpmnModeler.get('moddle'),
        eventBus: this.bpmnModeler.get('eventBus'),
        bpmnFactory: this.bpmnModeler.get('bpmnFactory'),
        elementRegistry: this.bpmnModeler.get('elementRegistry'),
        replace: this.bpmnModeler.get('replace'),
        selection: this.bpmnModeler.get('selection')
      }
      this.getActiveElement()
    },
    getActiveElement() {
      // 初始第一个选中元素 bpmn:Process
      this.initFormOnChanged(null)
      this.bpmnModeler.on('import.done', e => {
        this.initFormOnChanged(null)
      })
      // 监听选择事件，修改当前激活的元素以及表单
      this.bpmnModeler.on('selection.changed', ({ newSelection }) => {
        this.initFormOnChanged(newSelection[0] || null)
      })
      this.bpmnModeler.on('element.changed', ({ element }) => {
        // 保证 修改 "默认流转路径" 类似需要修改多个元素的事件发生的时候，更新表单的元素与原选中元素不一致。
        if (element && element.id === this.elementId) {
          this.initFormOnChanged(element)
        }
      })
    },
    // 初始化数据
    initFormOnChanged(element) {
      let activatedElement = element
      if (!activatedElement) {
        activatedElement =
          window.bpmnInstances.elementRegistry.find(el => el.type === 'bpmn:Process') ??
          window.bpmnInstances.elementRegistry.find(el => el.type === 'bpmn:Collaboration')
      }
      if (!activatedElement) return
      // console.log(`
      //         ----------
      // select element changed:
      //           id:  ${activatedElement.id}
      //         type:  ${activatedElement.businessObject.$type}
      //         ----------
      //         `)
      // console.log('businessObject: ', activatedElement.businessObject)
      window.bpmnInstances.bpmnElement = activatedElement
      this.bpmnElement = activatedElement
      this.elementId = activatedElement.id
      this.elementType = activatedElement.type.split(':')[1] || ''
      this.elementBusinessObject = JSON.parse(JSON.stringify(activatedElement.businessObject))
      this.conditionFormVisible = !!(
        this.elementType === 'SequenceFlow' &&
        activatedElement.source &&
        activatedElement.source.type.indexOf('StartEvent') === -1
      )
      this.formVisible = this.elementType === 'UserTask' || this.elementType === 'StartEvent'
    },
    beforeDestroy() {
      window.bpmnInstances = null
    }
  }
}
</script>

<style lang="scss" scoped>
.process-panel__container {
  box-sizing: border-box;
  border-left: 1px solid #eeeeee;
  box-shadow: 0 0 8px #cccccc;
  max-height: 100%;
  overflow-y: auto;
  ::v-deep .v-form {
    padding-top: 20px;
  }
}
</style>
