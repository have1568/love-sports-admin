<template>
  <div class="process-designer">
    <div class="process-designer__header">
      <slot name="control-header" />
      <template v-if="!$slots['control-header']">
        <v-row class="pl-3 pt-2">
          <v-btn-toggle dense class="mr-2">
            <v-btn @click="$refs.refFile.click()">
              <v-icon>
                mdi-file
              </v-icon>
              <span>打开文件</span>
            </v-btn>
            <v-menu offset-y>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                    v-bind="attrs"
                    v-on="on"
                >
                  <v-icon>
                    mdi-file-download
                  </v-icon>
                  <span>下载文件</span>
                </v-btn>
              </template>
              <v-list>
                <v-list-item>
                  <v-list-item-title @click="downloadProcessAsXml()">下载为XML文件</v-list-item-title>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title @click="downloadProcessAsSvg()">下载为SVG文件</v-list-item-title>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title @click="downloadProcessAsBpmn()">下载为BPMN文件</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
            <v-menu offset-y>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                    v-bind="attrs"
                    v-on="on"
                >
                  <v-icon>
                    mdi-file-code
                  </v-icon>
                  <span>预览</span>
                </v-btn>
              </template>
              <v-list>
                <v-list-item>
                  <v-list-item-title @click="previewProcessXML">预览XML</v-list-item-title>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title @click="previewProcessJson">预览JSON</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-btn-toggle>

          <v-btn-toggle dense class="mr-2">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                    v-bind="attrs"
                    class="hidden-lg-and-down"
                    v-on="on"
                    @click="elementsAlign('left')"
                >
                  <v-icon>
                    mdi-format-horizontal-align-left
                  </v-icon>
                </v-btn>
              </template>
              <span>向左对齐</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                    v-bind="attrs"
                    class="hidden-lg-and-down"
                    v-on="on"
                    @click="elementsAlign('right')"
                >
                  <v-icon>
                    mdi-format-horizontal-align-right
                  </v-icon>
                </v-btn>
              </template>
              <span>向右对齐</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                    v-bind="attrs"
                    class="hidden-lg-and-down"
                    v-on="on"
                    @click="elementsAlign('top')"
                >
                  <v-icon>
                    mdi-format-vertical-align-top
                  </v-icon>
                </v-btn>
              </template>
              <span>向上对齐</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                    v-bind="attrs"
                    class="hidden-lg-and-down"
                    v-on="on"
                    @click="elementsAlign('bottom')"
                >
                  <v-icon>
                    mdi-format-vertical-align-bottom
                  </v-icon>
                </v-btn>
              </template>
              <span>向下对齐</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                    v-bind="attrs"
                    class="hidden-lg-and-down"
                    v-on="on"
                    @click="elementsAlign('center')"
                >
                  <v-icon>
                    mdi-format-vertical-align-center
                  </v-icon>
                </v-btn>
              </template>
              <span>水平居中</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                    v-bind="attrs"
                    class="hidden-lg-and-down"
                    v-on="on"
                    @click="elementsAlign('middle')"
                >
                  <v-icon>
                    mdi-format-horizontal-align-center
                  </v-icon>
                </v-btn>
              </template>
              <span>垂直居中</span>
            </v-tooltip>
          </v-btn-toggle>

          <v-btn-toggle dense class="mr-2">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                    v-bind="attrs"
                    class="hidden-lg-and-down"
                    v-on="on"
                    @click="processZoomOut()"
                >
                  <v-icon>
                    mdi-minus-circle-outline
                  </v-icon>
                </v-btn>
              </template>
              <span>缩小视图</span>
            </v-tooltip>
            <v-btn class="hidden-lg-and-down">
              <span v-text="Math.floor(defaultZoom * 10 * 10) + '%'" />
            </v-btn>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                    v-bind="attrs"
                    class="hidden-lg-and-down"
                    v-on="on"
                    @click="processZoomIn()"
                >
                  <v-icon>
                    mdi-plus-circle-outline
                  </v-icon>
                </v-btn>
              </template>
              <span>放大视图</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                    v-bind="attrs"
                    class="hidden-lg-and-down"
                    v-on="on"
                    @click="processReZoom()"
                >
                  <v-icon>
                    mdi-circle-box-outline
                  </v-icon>
                </v-btn>
              </template>
              <span>重置视图并居中</span>
            </v-tooltip>
          </v-btn-toggle>

          <v-btn-toggle dense>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                    v-bind="attrs"
                    class="hidden-sm-and-down"
                    v-on="on"
                    @click="processUndo()"
                >
                  <v-icon>
                    mdi-undo
                  </v-icon>
                </v-btn>
              </template>
              <span class="hidden-sm-and-down">撤销</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                    v-bind="attrs"
                    class="hidden-sm-and-down"
                    v-on="on"
                    @click="processRedo()"
                >
                  <v-icon>
                    mdi-redo
                  </v-icon>
                </v-btn>
              </template>
              <span class="hidden-sm-and-down">恢复</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                    v-bind="attrs"
                    class="hidden-sm-and-down"
                    v-on="on"
                    @click="processRestart"
                >
                  <v-icon>
                    mdi-autorenew
                  </v-icon>
                </v-btn>
              </template>
              <span class="hidden-sm-and-down">重新绘制</span>
            </v-tooltip>
          </v-btn-toggle>
        </v-row>

      </template>
      <!-- 用于打开本地文件-->
      <input id="files" ref="refFile" type="file" style="display: none" accept=".xml, .bpmn" @change="importLocalFile">
    </div>
    <div class="process-designer__container">
      <div ref="bpmn-canvas" class="process-designer__canvas" />
    </div>
    <v-dialog
      v-model="previewModelVisible"
      scrollable
      max-width="80%"
    >
      <v-card>
        <v-card-title>预览</v-card-title>
        <v-card-text v-text="previewResult" />
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="primary"
            text
            @click="previewModelVisible = false"
          >
            关闭
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
// 生产环境时优化
import BpmnModeler from 'bpmn-js/lib/Modeler'
import DefaultEmptyXML from './plugins/defaultEmpty'
// 翻译方法
import customTranslate from './plugins/translate/customTranslate'
import translationsCN from './plugins/translate/zh'
// 模拟流转流程
import tokenSimulation from 'bpmn-js-token-simulation'
// 标签解析 Moddle
import camundaModdleDescriptor from './plugins/descriptor/camundaDescriptor.json'
import activitiModdleDescriptor from './plugins/descriptor/activitiDescriptor.json'
import flowableModdleDescriptor from './plugins/descriptor/flowableDescriptor.json'
// 标签解析 Extension
import camundaModdleExtension from './plugins/extension-moddle/camunda'
import activitiModdleExtension from './plugins/extension-moddle/activiti'
import flowableModdleExtension from './plugins/extension-moddle/flowable'
// 引入json转换与高亮
import convert from 'xml-js'

export default {
  name: 'ProcessDesigner',
  props: {
    value: {
      type: String,
      default: ''
    }, // xml 字符串
    processId: {
      type: String,
      default: ''
    },
    processName: {
      type: String,
      default: ''
    },
    translations: {
      type: Object,
      default: () => {
        return {}
      }
    }, // 自定义的翻译文件
    additionalModel: {
      type: [Object, Array],
      default: () => {}
    }, // 自定义model
    moddleExtension: {
      type: Object,
      default: () => {
        return {}
      }
    }, // 自定义moddle
    onlyCustomizeAddi: {
      type: Boolean,
      default: false
    },
    onlyCustomizeModdle: {
      type: Boolean,
      default: false
    },
    simulation: {
      type: Boolean,
      default: true
    },
    keyboard: {
      type: Boolean,
      default: true
    },
    prefix: {
      type: String,
      default: 'camunda'
    },
    events: {
      type: Array,
      default: () => ['element.click']
    }
  },
  data() {
    return {
      defaultZoom: 1,
      previewModelVisible: false,
      previewResult: '',
      previewType: 'xml',
      recoverable: false,
      revocable: false
    }
  },
  computed: {
    additionalModules() {
      const Modules = []
      // 仅保留用户自定义扩展模块
      if (this.onlyCustomizeAddi) {
        if (Object.prototype.toString.call(this.additionalModel) === '[object Array]') {
          return this.additionalModel || []
        }
        return [this.additionalModel]
      }

      // 插入用户自定义扩展模块
      if (Object.prototype.toString.call(this.additionalModel) === '[object Array]') {
        Modules.push(...this.additionalModel)
      } else {
        this.additionalModel && Modules.push(this.additionalModel)
      }

      // 翻译模块
      const TranslateModule = {
        translate: ['value', customTranslate(this.translations || translationsCN)]
      }
      Modules.push(TranslateModule)

      // 模拟流转模块
      if (this.simulation) {
        Modules.push(tokenSimulation)
      }

      // 根据需要的流程类型设置扩展元素构建模块
      // if (this.prefix === "bpmn") {
      //   Modules.push(bpmnModdleExtension);
      // }
      if (this.prefix === 'camunda') {
        Modules.push(camundaModdleExtension)
      }
      if (this.prefix === 'flowable') {
        Modules.push(flowableModdleExtension)
      }
      if (this.prefix === 'activiti') {
        Modules.push(activitiModdleExtension)
      }

      return Modules
    },
    moddleExtensions() {
      const Extensions = {}
      // 仅使用用户自定义模块
      if (this.onlyCustomizeModdle) {
        return this.moddleExtension || null
      }

      // 插入用户自定义模块
      if (this.moddleExtension) {
        for (const key in this.moddleExtension) {
          Extensions[key] = this.moddleExtension[key]
        }
      }

      // 根据需要的 "流程类型" 设置 对应的解析文件
      if (this.prefix === 'activiti') {
        Extensions.activiti = activitiModdleDescriptor
      }
      if (this.prefix === 'flowable') {
        Extensions.flowable = flowableModdleDescriptor
      }
      if (this.prefix === 'camunda') {
        Extensions.camunda = camundaModdleDescriptor
      }

      return Extensions
    }
  },
  mounted() {
    this.initBpmnModeler()
    this.createNewDiagram(this.value)
    this.$once('hook:beforeDestroy', () => {
      if (this.bpmnModeler) this.bpmnModeler.destroy()
      this.$emit('destroy', this.bpmnModeler)
      this.bpmnModeler = null
    })
  },
  methods: {
    initBpmnModeler() {
      if (this.bpmnModeler) return
      this.bpmnModeler = new BpmnModeler({
        container: this.$refs['bpmn-canvas'],
        keyboard: this.keyboard ? { bindTo: document } : null,
        additionalModules: this.additionalModules,
        moddleExtensions: this.moddleExtensions
      })
      this.$emit('init-finished', this.bpmnModeler)
      this.initModelListeners()
    },
    initModelListeners() {
      const EventBus = this.bpmnModeler.get('eventBus')
      const that = this
      // 注册需要的监听事件, 将. 替换为 - , 避免解析异常
      this.events.forEach(event => {
        EventBus.on(event, function(eventObj) {
          const eventName = event.replace(/\./g, '-')
          const element = eventObj ? eventObj.element : null
          that.$emit(eventName, element, eventObj)
        })
      })
      // 监听图形改变返回xml
      EventBus.on('commandStack.changed', async event => {
        try {
          this.recoverable = this.bpmnModeler.get('commandStack').canRedo()
          this.revocable = this.bpmnModeler.get('commandStack').canUndo()
          const { xml } = await this.bpmnModeler.saveXML({ format: true })
          this.$emit('commandStack-changed', event)
          this.$emit('input', xml)
          this.$emit('change', xml)
        } catch (e) {
          console.error(`[Process Designer Warn]: ${e.message || e}`)
        }
      })
      // 监听视图缩放变化
      this.bpmnModeler.on('canvas.viewbox.changed', ({ viewbox }) => {
        this.$emit('canvas-viewbox-changed', { viewbox })
        const { scale } = viewbox
        this.defaultZoom = Math.floor(scale * 100) / 100
      })
    },
    /* 创建新的流程图 */
    async createNewDiagram(xml) {
      // 将字符串转换成图显示出来
      const newId = this.processId || `Process_${new Date().getTime()}`
      const newName = this.processName || `业务流程_${new Date().getTime()}`
      const xmlString = xml || DefaultEmptyXML(newId, newName, this.prefix)
      try {
        const { warnings } = await this.bpmnModeler.importXML(xmlString)
        if (warnings && warnings.length) {
          warnings.forEach(warn => console.warn(warn))
        }
      } catch (e) {
        console.error(`[Process Designer Warn]: ${e.message || e}`)
      }
    },

    // 下载流程图到本地
    async downloadProcess(type, name) {
      try {
        const _this = this
        // 按需要类型创建文件并下载
        if (type === 'xml' || type === 'bpmn') {
          const { err, xml } = await this.bpmnModeler.saveXML()
          // 读取异常时抛出异常
          if (err) {
            console.error(`[Process Designer Warn ]: ${err.message || err}`)
          }
          const { href, filename } = _this.setEncoded(type.toUpperCase(), name, xml)
          downloadFunc(href, filename)
        } else {
          const { err, svg } = await this.bpmnModeler.saveSVG()
          // 读取异常时抛出异常
          if (err) {
            return console.error(err)
          }
          const { href, filename } = _this.setEncoded('SVG', name, svg)
          downloadFunc(href, filename)
        }
      } catch (e) {
        console.error(`[Process Designer Warn ]: ${e.message || e}`)
      }
      // 文件下载方法
      function downloadFunc(href, filename) {
        if (href && filename) {
          const a = document.createElement('a')
          a.download = filename // 指定下载的文件名
          a.href = href //  URL对象
          a.click() // 模拟点击
          URL.revokeObjectURL(a.href) // 释放URL 对象
        }
      }
    },

    // 根据所需类型进行转码并返回下载地址
    setEncoded(type, filename = 'diagram', data) {
      const encodedData = encodeURIComponent(data)
      return {
        filename: `${filename}.${type}`,
        href: `data:application/${type === 'svg' ? 'text/xml' : 'bpmn20-xml'};charset=UTF-8,${encodedData}`,
        data: data
      }
    },

    // 加载本地文件
    importLocalFile() {
      const that = this
      const file = this.$refs.refFile.files[0]
      const reader = new FileReader()
      reader.readAsText(file)
      reader.onload = function() {
        const xmlStr = this.result
        that.createNewDiagram(xmlStr)
      }
    },
    /* ------------------------------------------------ refs methods ------------------------------------------------------ */
    downloadProcessAsXml() {
      this.downloadProcess('xml')
    },
    downloadProcessAsBpmn() {
      this.downloadProcess('bpmn')
    },
    downloadProcessAsSvg() {
      this.downloadProcess('svg')
    },
    processRedo() {
      this.bpmnModeler.get('commandStack').redo()
    },
    processUndo() {
      this.bpmnModeler.get('commandStack').undo()
    },
    processZoomIn(zoomStep = 0.1) {
      const newZoom = Math.floor(this.defaultZoom * 100 + zoomStep * 100) / 100
      if (newZoom > 4) {
        throw new Error('[Process Designer Warn ]: The zoom ratio cannot be greater than 4')
      }
      this.defaultZoom = newZoom
      this.bpmnModeler.get('canvas').zoom(this.defaultZoom)
    },
    processZoomOut(zoomStep = 0.1) {
      const newZoom = Math.floor(this.defaultZoom * 100 - zoomStep * 100) / 100
      if (newZoom < 0.2) {
        throw new Error('[Process Designer Warn ]: The zoom ratio cannot be less than 0.2')
      }
      this.defaultZoom = newZoom
      this.bpmnModeler.get('canvas').zoom(this.defaultZoom)
    },
    processZoomTo(newZoom = 1) {
      if (newZoom < 0.2) {
        throw new Error('[Process Designer Warn ]: The zoom ratio cannot be less than 0.2')
      }
      if (newZoom > 4) {
        throw new Error('[Process Designer Warn ]: The zoom ratio cannot be greater than 4')
      }
      this.defaultZoom = newZoom
      this.bpmnModeler.get('canvas').zoom(newZoom)
    },
    processReZoom() {
      this.defaultZoom = 1
      this.bpmnModeler.get('canvas').zoom('fit-viewport', 'auto')
    },
    processRestart() {
      this.recoverable = false
      this.revocable = false
      this.createNewDiagram(null).then(() => this.bpmnModeler.get('canvas').zoom(1, 'auto'))
    },
    elementsAlign(align) {
      const Align = this.bpmnModeler.get('alignElements')
      const Selection = this.bpmnModeler.get('selection')
      const SelectedElements = Selection.get()
      if (!SelectedElements || SelectedElements.length <= 1) {
        this.$message.warning('请按住 Ctrl 键选择多个元素对齐')
        return
      }
      this.$confirm('自动对齐可能造成图形变形，是否继续？', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => Align.trigger(SelectedElements, align))
    },
    /* -----------------------------    方法结束     ---------------------------------*/
    previewProcessXML() {
      this.bpmnModeler.saveXML({ format: true }).then(({ xml }) => {
        this.previewResult = xml
        this.previewType = 'xml'
        this.previewModelVisible = true
      })
    },
    previewProcessJson() {
      this.bpmnModeler.saveXML({ format: true }).then(({ xml }) => {
        this.previewResult = convert.xml2json(xml, { spaces: 2 })
        this.previewType = 'json'
        this.previewModelVisible = true
      })
    }
  }
}
</script>

<style lang="css" scoped>
.process-designer {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}
  .process-designer__container {
    display: flex;
    width: 100%;
    flex: 1;

  }
.process-designer__canvas {
  flex: 1;
  height: 100%;
  position: relative;
  background: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImEiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTTAgMTBoNDBNMTAgMHY0ME0wIDIwaDQwTTIwIDB2NDBNMCAzMGg0ME0zMCAwdjQwIiBmaWxsPSJub25lIiBzdHJva2U9IiNlMGUwZTAiIG9wYWNpdHk9Ii4yIi8+PHBhdGggZD0iTTQwIDBIMHY0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZTBlMGUwIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2EpIi8+PC9zdmc+");
  background-repeat: repeat;
}
.process-designer__header {
  width: 100%;
  min-height: 36px;
}

</style>
