<template>
  <div class="panel-tab__content">
    <v-form @submit.native.prevent>
      <v-text-field
        v-model="formKey"
        label="表单标识"
        @change="updateElementFormKey"
      />
      <v-select
        v-model="businessKey"
        :items="fieldList"
        item-text="label"
        item-value="id"
        label="业务标识"
        @change="updateElementBusinessKey"
      />
    </v-form>

    <!--字段列表-->
    <div class="diy-divider diy-divider--horizontal">
      <div class="diy-divider__text is-center"><v-icon small class="mr-1">mdi-form-textbox</v-icon>表单字段</div>
    </div>
    <v-simple-table dense class="table-border-full mb-3">
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-left">
              序号
            </th>
            <th class="text-left">
              字段名称
            </th>
            <th class="text-left">
              字段类型
            </th>
            <th class="text-left">
              默认值
            </th>
            <th class="text-left">
              操作
            </th>
          </tr>
        </thead>
        <tbody v-if="fieldList.length > 0">
          <tr
            v-for="(item, index) in fieldList"
            :key="index"
          >
            <td v-text="index" />
            <td v-text="item.label" />
            <td v-text="item.type" />
            <td v-text="item.defaultValue" />
            <td>
              <v-btn small text color="primary" class="mr-2" @click="openFieldForm(item, index)">编辑</v-btn>
              <v-btn small text color="error" @click="removeField(item, index)">移除</v-btn>
            </td>
          </tr>
        </tbody>
        <tbody v-else>
          <tr>
            <td colspan="5" align="center">暂无数据</td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
    <div>
      <v-btn small block color="primary" @click="openFieldForm(null, -1)">添加字段</v-btn>
    </div>

    <!--字段配置侧边栏-->
    <v-dialog v-model="fieldModelVisible" :width="`${width}px`">
      <v-card>
        <v-card-title class="text-h5 grey lighten-2">字段配置</v-card-title>
        <v-card-text>
          <v-form @submit.native.prevent>
            <v-text-field
              v-model="formFieldForm.id"
              label="字段ID"
            />
            <v-select
              v-model="formFieldForm.typeType"
              :items="fieldType"
              label="类型"
              @change="updateElementBusinessKey"
            />
            <v-text-field
              v-if="formFieldForm.typeType === 'custom'"
              v-model="formFieldForm.type"
              label="类型名称"
            />
            <v-text-field
              v-model="formFieldForm.label"
              label="名称"
            />
            <v-text-field
              v-if="formFieldForm.typeType === 'date'"
              v-model="formFieldForm.datePattern"
              label="时间格式"
            />
            <v-text-field
              v-model="formFieldForm.defaultValue"
              label="默认值"
            />
          </v-form>

          <!-- 枚举值设置 -->
          <template v-if="formFieldForm.typeType === 'enum'">
            <v-divider />
            <div class="d-flex justify-space-between mt-3 mb-3">
              <span><v-icon small class="mr-1">mdi-view-list</v-icon>枚举值列表：</span>
              <v-btn small color="primary" @click="openFieldOptionForm(null, -1, 'enum')">添加枚举值</v-btn>
            </div>
            <v-simple-table dense class="table-border-full mb-3">
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-left">
                      序号
                    </th>
                    <th class="text-left">
                      枚举值编号
                    </th>
                    <th class="text-left">
                      枚举值名称
                    </th>
                    <th class="text-left">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody v-if="fieldEnumList.length > 0">
                  <tr
                    v-for="(item, index) in fieldEnumList"
                    :key="index"
                  >
                    <td v-text="index" />
                    <td v-text="item.id" />
                    <td v-text="item.name" />
                    <td>
                      <v-btn small text color="primary" class="mr-2" @click="openFieldOptionForm(item, index, 'enum')">编辑</v-btn>
                      <v-btn small text color="error" @click="removeFieldOptionItem(item, index, 'enum')">移除</v-btn>
                    </td>
                  </tr>
                </tbody>
                <tbody v-else>
                  <tr>
                    <td colspan="5" align="center">暂无数据</td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </template>

          <!-- 校验规则 -->
          <v-divider />
          <div class="d-flex justify-space-between mt-3 mb-3">
            <span><v-icon small class="mr-1">mdi-axis-arrow-info</v-icon>约束条件列表：</span>
            <v-btn small color="primary" @click="openFieldOptionForm(null, -1, 'constraint')">添加约束</v-btn>
          </div>
          <v-simple-table dense class="table-border-full mb-3">
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-left">
                    序号
                  </th>
                  <th class="text-left">
                    约束名称
                  </th>
                  <th class="text-left">
                    约束配置
                  </th>
                  <th class="text-left">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody v-if="fieldConstraintsList.length > 0">
                <tr
                  v-for="(item, index) in fieldConstraintsList"
                  :key="index"
                >
                  <td v-text="index" />
                  <td v-text="item.name" />
                  <td v-text="item.config" />
                  <td>
                    <v-btn small text color="primary" class="mr-2" @click="openFieldOptionForm(item, index, 'constraint')">编辑</v-btn>
                    <v-btn small text color="error" @click="removeFieldOptionItem(item, index, 'constraint')">移除</v-btn>
                  </td>
                </tr>
              </tbody>
              <tbody v-else>
                <tr>
                  <td colspan="5" align="center">暂无数据</td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>

          <!-- 表单属性 -->
          <v-divider />
          <div class="d-flex justify-space-between mt-3 mb-3">
            <span><v-icon small class="mr-1">mdi-form-select</v-icon>字段属性列表：</span>
            <v-btn small color="primary" @click="openFieldOptionForm(null, -1, 'property')">添加属性</v-btn>
          </div>
          <v-simple-table dense class="table-border-full mb-3">
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-left">
                    序号
                  </th>
                  <th class="text-left">
                    属性编号
                  </th>
                  <th class="text-left">
                    属性值
                  </th>
                  <th class="text-left">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody v-if="fieldPropertiesList.length > 0">
                <tr
                  v-for="(item, index) in fieldPropertiesList"
                  :key="index"
                >
                  <td v-text="index" />
                  <td v-text="item.id" />
                  <td v-text="item.value" />
                  <td>
                    <v-btn small text color="primary" class="mr-2" @click="openFieldOptionForm(item, index, 'property')">编辑</v-btn>
                    <v-btn small text color="error" @click="removeFieldOptionItem(item, index, 'property')">移除</v-btn>
                  </td>
                </tr>
              </tbody>
              <tbody v-else>
                <tr>
                  <td colspan="5" align="center">暂无数据</td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn small @click="fieldModelVisible = !fieldModelVisible">取 消</v-btn>
          <v-btn small color="primary" @click="saveField">保 存</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="fieldOptionModelVisible" width="600px">
      <v-card>
        <v-card-title class="text-h5 grey lighten-2" v-text="optionModelTitle" />
        <v-card-text>
          <v-form @submit.native.prevent>
            <v-text-field
              v-if="fieldOptionType !== 'constraint'"
              v-model="fieldOptionForm.id"
              label="编号/ID"
            />
            <v-text-field
              v-if="fieldOptionType !== 'property'"
              v-model="fieldOptionForm.name"
              label="名称"
            />
            <v-text-field
              v-if="fieldOptionType !== 'constraint'"
              v-model="fieldOptionForm.config"
              label="配置"
            />
            <v-text-field
              v-if="fieldOptionType !== 'property'"
              v-model="fieldOptionForm.value"
              label="值"
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text class="mr-2" @click="fieldOptionModelVisible = false">取 消</v-btn>
          <v-btn text color="primary" @click="saveFieldOption">确 定</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: 'PanelForm',
  props: {
    id: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: ''
    }
  },
  inject: {
    prefix: 'prefix',
    width: 'width'
  },
  data() {
    return {
      formKey: '',
      businessKey: '',
      optionModelTitle: '',
      fieldList: [],
      formFieldForm: {},
      fieldType: [{
        text: '长整型',
        value: 'long'
      }, {
        text: '字符串',
        value: 'string'
      }, {
        text: '布尔类',
        value: 'boolean'
      }, {
        text: '日期类',
        value: 'date'
      }, {
        text: '枚举类',
        value: 'enum'
      }, {
        text: '自定义类型',
        value: 'custom'
      }],
      formFieldIndex: -1, // 编辑中的字段， -1 为新增
      formFieldOptionIndex: -1, // 编辑中的字段配置项， -1 为新增
      fieldModelVisible: false,
      fieldOptionModelVisible: false,
      fieldOptionForm: {}, // 当前激活的字段配置项数据
      fieldOptionType: '', // 当前激活的字段配置项弹窗 类型
      fieldEnumList: [], // 枚举值列表
      fieldConstraintsList: [], // 约束条件列表
      fieldPropertiesList: [] // 绑定属性列表
    }
  },
  watch: {
    id: {
      immediate: true,
      handler(val) {
        val && val.length && this.$nextTick(() => this.resetFormList())
      }
    }
  },
  methods: {
    resetFormList() {
      this.bpmnELement = window.bpmnInstances.bpmnElement
      this.formKey = this.bpmnELement.businessObject.formKey
      // 获取元素扩展属性 或者 创建扩展属性
      this.elExtensionElements =
        this.bpmnELement.businessObject.get('extensionElements') || window.bpmnInstances.moddle.create('bpmn:ExtensionElements', { values: [] })
      // 获取元素表单配置 或者 创建新的表单配置
      this.formData =
        this.elExtensionElements.values.filter(ex => ex.$type === `${this.prefix}:FormData`) ? [0]
          : window.bpmnInstances.moddle.create(`${this.prefix}:FormData`, { fields: [] })

      // 业务标识 businessKey， 绑定在 formData 中
      this.businessKey = this.formData.businessKey

      // 保留剩余扩展元素，便于后面更新该元素对应属性
      this.otherExtensions = this.elExtensionElements.values.filter(ex => ex.$type !== `${this.prefix}:FormData`)

      // 复制原始值，填充表格
      this.fieldList = JSON.parse(JSON.stringify(this.formData.fields || []))

      // 更新元素扩展属性，避免后续报错
      this.updateElementExtensions()
    },
    updateElementFormKey() {
      window.bpmnInstances.modeling.updateProperties(this.bpmnELement, { formKey: this.formKey })
    },
    updateElementBusinessKey() {
      window.bpmnInstances.modeling.updateModdleProperties(this.bpmnELement, this.formData, { businessKey: this.businessKey })
    },
    // 根据类型调整字段type
    changeFieldTypeType(type) {
      this.$set(this.formFieldForm, 'type', type === 'custom' ? '' : type)
    },

    // 打开字段详情侧边栏
    openFieldForm(field, index) {
      this.formFieldIndex = index
      if (index !== -1) {
        const FieldObject = this.formData.fields[index]
        this.formFieldForm = JSON.parse(JSON.stringify(field))
        // 设置自定义类型
        this.$set(this.formFieldForm, 'typeType', !this.fieldType[field.type] ? 'custom' : field.type)
        // 初始化枚举值列表
        field.type === 'enum' && (this.fieldEnumList = JSON.parse(JSON.stringify(FieldObject?.values || [])))
        // 初始化约束条件列表
        this.fieldConstraintsList = JSON.parse(JSON.stringify(FieldObject?.validation?.constraints || []))
        // 初始化自定义属性列表
        this.fieldPropertiesList = JSON.parse(JSON.stringify(FieldObject?.properties?.values || []))
      } else {
        this.formFieldForm = {}
        // 初始化枚举值列表
        this.fieldEnumList = []
        // 初始化约束条件列表
        this.fieldConstraintsList = []
        // 初始化自定义属性列表
        this.fieldPropertiesList = []
      }
      this.fieldModelVisible = true
    },
    // 打开字段 某个 配置项 弹窗
    openFieldOptionForm(option, index, type) {
      this.fieldOptionModelVisible = true
      this.fieldOptionType = type
      this.formFieldOptionIndex = index
      if (type === 'property') {
        this.fieldOptionForm = option ? JSON.parse(JSON.stringify(option)) : {}
        return (this.optionModelTitle = '属性配置')
      }
      if (type === 'enum') {
        this.fieldOptionForm = option ? JSON.parse(JSON.stringify(option)) : {}
        return (this.optionModelTitle = '枚举值配置')
      }
      this.fieldOptionForm = option ? JSON.parse(JSON.stringify(option)) : {}
      return (this.optionModelTitle = '约束条件配置')
    },

    // 保存字段 某个 配置项
    saveFieldOption() {
      if (this.formFieldOptionIndex === -1) {
        if (this.fieldOptionType === 'property') {
          this.fieldPropertiesList.push(this.fieldOptionForm)
        }
        if (this.fieldOptionType === 'constraint') {
          this.fieldConstraintsList.push(this.fieldOptionForm)
        }
        if (this.fieldOptionType === 'enum') {
          this.fieldEnumList.push(this.fieldOptionForm)
        }
      } else {
        this.fieldOptionType === 'property' && this.fieldPropertiesList.splice(this.formFieldOptionIndex, 1, this.fieldOptionForm)
        this.fieldOptionType === 'constraint' && this.fieldConstraintsList.splice(this.formFieldOptionIndex, 1, this.fieldOptionForm)
        this.fieldOptionType === 'enum' && this.fieldEnumList.splice(this.formFieldOptionIndex, 1, this.fieldOptionForm)
      }
      this.fieldOptionModelVisible = false
      this.fieldOptionForm = {}
    },
    // 保存字段配置
    saveField() {
      const { id, type, label, defaultValue, datePattern } = this.formFieldForm
      const Field = window.bpmnInstances.moddle.create(`${this.prefix}:FormField`, { id, type, label })
      defaultValue && (Field.defaultValue = defaultValue)
      datePattern && (Field.datePattern = datePattern)
      // 构建属性
      if (this.fieldPropertiesList && this.fieldPropertiesList.length) {
        const fieldPropertyList = this.fieldPropertiesList.map(fp => {
          return window.bpmnInstances.moddle.create(`${this.prefix}:Property`, { id: fp.id, value: fp.value })
        })
        Field.properties = window.bpmnInstances.moddle.create(`${this.prefix}:Properties`, { values: fieldPropertyList })
      }
      // 构建校验规则
      if (this.fieldConstraintsList && this.fieldConstraintsList.length) {
        const fieldConstraintList = this.fieldConstraintsList.map(fc => {
          return window.bpmnInstances.moddle.create(`${this.prefix}:Constraint`, { name: fc.name, config: fc.config })
        })
        Field.validation = window.bpmnInstances.moddle.create(`${this.prefix}:Validation`, { constraints: fieldConstraintList })
      }
      // 构建枚举值
      if (this.fieldEnumList && this.fieldEnumList.length) {
        Field.values = this.fieldEnumList.map(fe => {
          return window.bpmnInstances.moddle.create(`${this.prefix}:Value`, { name: fe.name, id: fe.id })
        })
      }
      // 更新数组 与 表单配置实例
      if (this.formFieldIndex === -1) {
        this.fieldList.push(this.formFieldForm)
        this.formData.fields.push(Field)
      } else {
        this.fieldList.splice(this.formFieldIndex, 1, this.formFieldForm)
        this.formData.fields.splice(this.formFieldIndex, 1, Field)
      }
      this.updateElementExtensions()
      this.fieldModelVisible = false
    },

    // 移除某个 字段的 配置项
    removeFieldOptionItem(option, index, type) {
      if (type === 'property') {
        this.fieldPropertiesList.splice(index, 1)
        return
      }
      if (type === 'enum') {
        this.fieldEnumList.splice(index, 1)
        return
      }
      this.fieldConstraintsList.splice(index, 1)
    },
    // 移除 字段
    removeField(field, index) {
      this.fieldList.splice(index, 1)
      this.formData.fields.splice(index, 1)
      this.updateElementExtensions()
    },

    updateElementExtensions() {
      // 更新回扩展元素
      const newElExtensionElements = window.bpmnInstances.moddle.create(`bpmn:ExtensionElements`, {
        values: this.otherExtensions.concat(this.formData)
      })
      // 更新到元素上
      window.bpmnInstances.modeling.updateProperties(this.bpmnELement, {
        extensionElements: newElExtensionElements
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.diy-divider {
  background-color: #DCDFE6;
  position: relative;
  &.diy-divider--horizontal {
    display: block;
    height: 1px;
    width: 100%;
    margin: 24px 0;
    .diy-divider__text {
        position: absolute;
        background-color: #FFFFFF;
        padding: 0 20px;
        font-weight: 500;
        color: #303133;
        font-size: 14px;
    }
    .diy-divider__text {
      &.is-center {
        left: 50%;
        transform: translateX(-50%) translateY(-50%);
      }
    }
  }
}
.table-border-full {
  th {
    border-top: 1px solid #EBEEF5;
    border-right: 1px solid #EBEEF5;
    &:first-child {
      border-left: 1px solid #EBEEF5;
    }
  }
  td {
    border-right: 1px solid #EBEEF5;
    border-bottom: 1px solid #EBEEF5;
    &:first-child {
      border-left: 1px solid #EBEEF5;
    }
  }
}
</style>
