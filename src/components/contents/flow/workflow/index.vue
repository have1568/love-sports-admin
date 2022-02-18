<template>
  <v-card  class="d-flex flex-column" elevation="0" height="95%" fluid>
    <v-row>
      <v-col cols="10">
        <v-card class="d-flex flex-column ma-6 pa-4" height="98%" elevation="1">
          <process-designer
              :key="`designer-${reloadIndex}`"
              ref="processDesigner"
              v-model="xmlString"
              v-bind="controlForm"
              keyboard
              @element-click="elementClick"
              @init-finished="initModeler"
          />
        </v-card>
      </v-col>
      <v-col cols="2">
        <properties-panel :key="`penal-${reloadIndex}`" :bpmn-modeler="modeler" :prefix="controlForm.prefix" />
      </v-col>
    </v-row>
  </v-card>






</template>

<script>
import 'bpmn-js/dist/assets/diagram-js.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css'
import 'bpmn-js-properties-panel/dist/assets/bpmn-js-properties-panel.css'
import ProcessDesigner from '../ProcessDesigner'
import PropertiesPanel from '../ProcessDesigner/refactor/PropertiesPanel'
// 自定义元素选中时的弹出菜单（修改 默认任务 为 用户任务）
// import CustomContentPadProvider from '@/components/ProcessDesigner/plugins/content-pad'
// 自定义左侧菜单（修改 默认任务 为 用户任务）
// import CustomPaletteProvider from '@/components/ProcessDesigner/plugins/palette'

export default {
  name: 'Workflow',
  components: { ProcessDesigner, PropertiesPanel },
  data() {
    return {
      xmlString: '',
      modeler: null,
      reloadIndex: 0,
      controlDrawerVisible: false,
      controlForm: {
        processId: '',
        processName: '',
        simulation: true,
        labelEditing: false,
        labelVisible: false,
        prefix: 'activiti'
        // additionalModel: [CustomContentPadProvider, CustomPaletteProvider]
      },
      addis: {},
      element: null
    }
  },
  methods: {
    initModeler(modeler) {
      setTimeout(() => {
        this.modeler = modeler
      }, 10)
    },
    elementClick(element) {
      this.element = element
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
