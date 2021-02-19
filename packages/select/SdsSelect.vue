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
        :default-keys="defaultKeys"
        :highlight-current="!showCheckbox && !showCheckRadio"
        :show-checkbox="showCheckbox"
        :show-check-radio="showCheckRadio"
        :default-expand-keys="defaultExpandedKey"
        @nodeClick="handleNodeClick"
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
      // 高亮
      highlightCurrent: {
        type: Boolean,
        default: false
      },
      // 初始选中/选中的项
      defaultKeys: Array
    },
    watch: {
      selectArray (newVal, oldVal) {
        this.$emit('input', newVal)
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
        // 设置选中项和v-model
        if (!this.showCheckbox) {
          this.value = this.selectNode.length !== 0 ? this.selectNode[0].label : ''
        } else {
          this.value = keys.length !== 0 ? `已选中${keys.length}项` : '';
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
        let avaiableNode = data.checkedNodes && data.checkedNodes.filter(checked => {
          return !checked.children || (checked.children && checked.children.length === 0)
        })
        this.selectArray = avaiableNode
        this.value = avaiableNode.length !== 0 ? `已选中${avaiableNode.length}项` : '';
        this.$emit('check', node, data)
      },
      handleNodeClick (data, node, tree) {
        this.selectArray = [data]
        this.value = data.label
      },
      handleClear () {
        this.$refs[this.treeRef].$emit('setKeys', [])
        this.selectArray = [];
      }
    }
  }
</script>

<style scoped>

</style>
