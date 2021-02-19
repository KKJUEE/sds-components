<template>
  <el-select v-bind="{...$attrs}" v-model="value" class="sds-select" @clear="handleClear">
    <el-option v-if="showTree" :value="value" class="sds-select__dropdown">
      <sds-tree
        id="tree-options"
        v-bind="{...$attrs}"
        :data="data"
        :props="defaultProps"
        :node-key="nodeKey"
        :ref="treeRef"
        v-model="selectArray"
        :default-keys="defaultCheckedKeys"
        :highlight-current="!showCheckbox && !showCheckRadio"
        :show-checkbox="showCheckbox"
        :show-check-radio="showCheckRadio"
        :show-check-radio-multiple="showCheckRadioMultiple"
        :default-expand-keys="defaultExpandedKey"
        @node-click="handleNodeClick"
        @check="check">
        <template v-slot:description>
          <slot name="description"></slot>
        </template>
        <slot></slot>
      </sds-tree>
    </el-option>
    <slot></slot>
  </el-select>
</template>

<script>
  import { formatStr } from "../utils/utils";

  export default {
    name: "sds-select",
    inheritAttrs: false,
    data () {
      return {
        // select的v-model属性,展示作用
        value: '',
        // 对外暴露的v-model绑定
        selectArray: Object,
        // 初始化时作用的默认选择node
        selectNode: Array,
        // 默认展开/选中项
        defaultExpandedKey: [],
        defaultCheckedKeys: this.defaultKeys,
        defaultProps: {
          children: 'children',
          label: 'label'
        },
      }
    },
    props: {
      treeRef: {
        type: String,
        default: 'tree'
      },
      data: Array,
      simple: {
        type: Boolean,
        default: false
      },
      nodeKey: {
        type: String,
        default: 'id'
      },
      // select关联tree
      showTree: {
        type: Boolean,
        default: false
      },
      // tree展示为复选框
      showCheckbox: {
        type: Boolean,
        default: false
      },
      // tree展示为单选
      showCheckRadio: {
        type: Boolean,
        default: false
      },
      showCheckRadioMultiple: {
        type: Boolean,
        default: false
      },
      // 高亮
      highlightCurrent: {
        type: Boolean,
        default: false
      },
      // 初始选中/选中的项
      defaultKeys: Array,
      formatSelectText: {
        type: String,
        default () {
          return this.$t("components.select_item");
        }
      }
    },
    watch: {
      selectArray (newVal, oldVal) {
        if (((this.simple && !this.showCheckbox) || this.showCheckRadio) &&
          newVal.length !== 0 && newVal[0].children &&
          newVal[0].children.length !== 0) {
          this.$emit('input', [])
        } else {
          this.$emit('input', newVal)
        }
      },
      defaultKeys (val) {
        this.setDefaultKeys(val)
      }
    },
    methods: {
      setDefaultKeys (keys) {
        // check/radio和普通tree
        this.selectNode = []
        for (let node of this.data) { // 默认传入的为key，需要的为label值
          this.getSelectNodes(node, keys)
          this.selectArray = this.selectNode
        }
        const formatText = this.formatSelectText;
        // 设置选中项和v-model
        if (!this.showCheckbox) {
          this.value = this.selectNode.length !== 0 ? this.selectNode[0].label : ''
        } else {
          this.value = keys.length !== 0 ? formatStr(formatText, keys.length) : '';
        }
      },
      /**
       * tree通过key获取label
       */
      getSelectNodes (node, keys) {
        if (keys.includes(node.id)) {
          this.selectNode.push(node)
        }
        if (node.children !== null && node.children instanceof Array) {
          for (let child of node.children) {
            this.getSelectNodes(child, keys)
          }
        }
      },
      check (node, data) {
        if (this.showCheckbox) {
          let avaiableNode = data.checkedNodes && data.checkedNodes.filter(checked => {
            return !checked.children || (checked.children && checked.children.length === 0)
          });
          this.selectArray = avaiableNode;
          const formatText = this.formatSelectText;
          const len = avaiableNode.length;
          this.value = len !== 0 ? formatStr(formatText, len) : '';
          this.$emit('check', node, data)
        }
      },
      handleNodeClick (data, node, tree) {
        if (this.showCheckRadioMultiple) {
          this.value = this.selectArray.length !== 0 ? `已选中${this.selectArray.length}项` : '';
        } else {
          this.selectArray = [data]
          if (((this.simple && !this.showCheckbox) || this.showCheckRadio) &&
            data.children && data.children.length !== 0) {
            this.value = ''
          } else {
            this.value = data.label
          }
        }
      },
      handleClear () {
        this.defaultCheckedKeys = []
        this.selectArray = [];
      }
    }
  }
</script>
