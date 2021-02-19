<template>
  <div class="sds-tree__container">
    <div class="sds-tree__search"
      v-if="$slots.search || showSearch" @click="pauseEvent">
      <slot name="search">
        <el-input
          :placeholder="placeholder"
          :prefix-icon="prefixIcon || ''"
          :suffix-icon="suffixIcon || ''"
          v-model="filterText">
        </el-input>
      </slot>
    </div>
    <div class="sds-tree__description"
      v-if="$slots.description || showDescription" @click="pauseEvent">
      <slot name="description">
        <span>{{description}}</span>
      </slot>
    </div>
    <slot name="custom-element"></slot>
    <el-tree
      :ref="treeRef"
      class="sds-tree__custom-tree"
      :class="[{'is-custom-icon': customIcon, 'is-checkbox': showCheckbox}]"
      v-bind="{...$attrs}"
      node-key="id"
      :data="treeData"
      :props="defaultProps"
      @node-click="handleNodeClick"
      :filter-node-method="filterNode"
      @check="check"
      :default-keys="defaultKeys"
      :current-node-key="currentNodeKey"
      :default-expanded-keys="defaultExpendedKeys"
      :show-checkbox="showCheckbox"
      :show-check-radio="showCheckRadio">
      <span slot-scope="{ node, data }">
        <span class="custom-tree-node">
          <span>
            <label class="tree-checkbox">
              <slot name="label">
                <span v-if="showCheckRadio && node.isLeaf">
                  <el-radio :label="data.label"
                    v-model="selectedVal"
                    class="tree-radio">
                    <span>
                      <span class="custom-tree-node__label-text">{{data.label}}</span>
                      <span :title="data.desc"
                        v-if="!!data.desc"
                        class="custom-tree-node__label-desc"
                        :class="data.descClass">
                        {{data.desc}}
                      </span>
                      <span v-if="!!data.status"
                        class="custom-tree-node__label-status"
                        :class="data.statusClass">
                        {{data.status}}
                      </span>
                    </span>
                  </el-radio>
                </span>
                <span v-if="showCheckRadioMultiple && node.isLeaf">
                  <el-radio :label="data.label"
                            v-model="selectedMultipleVal[getFirstParent(node)]"
                            class="tree-radio">
                    <span>
                      <span class="custom-tree-node__label-text">{{data.label}}</span>
                      <span :title="data.desc"
                            v-if="!!data.desc"
                            class="custom-tree-node__label-desc"
                            :class="data.descClass"> {{data.desc}}</span>
                      <span v-if="!!data.status"
                            class="custom-tree-node__label-status"
                            :class="data.statusClass"> {{data.status}}</span>
                    </span>
                  </el-radio>
                </span>
                <span v-else>
                  <span class="custom-tree-node__label-text">{{data.label}}</span>
                  <span :title="data.desc"
                    v-if="!!data.desc"
                    class="custom-tree-node__label-desc"
                    :class="data.descClass">
                    {{data.desc}}
                  </span>
                  <span v-if="!!data.status"
                    class="custom-tree-node__label-status"
                    :class="data.statusClass">
                    {{data.status}}
                  </span>
                </span>
              </slot>
            </label>
          </span>
        </span>
      </span>
      <slot></slot>
    </el-tree>
  </div>
</template>

<script>
  import { pauseEvent } from "../utils/utils"; // 需要全局国际化
  export default {
    name: "sds-tree",
    inheritAttrs: false,
    props: {
      treeRef: {
        type: String,
        default: 'tree'
      },
      data: {
        type: Array
      },
      showSearch: {
        type: Boolean,
        default: false
      },
      // 展示描述信息，支持自定义内容
      showDescription: {
        type: Boolean,
        default: false
      },
      placeholder: {
        type: String,
        default () {
          return '搜索';
        }
      },
      // 自定义tree的图标
      customIcon: {
        type: Boolean,
        default: false
      },
      // 自定义搜索框前缀图标
      prefixIcon: String,
      // 自定义搜索框后缀图标
      suffixIcon: String,
      description: String,
      emptyText: {
        type: String,
        default () {
          return this.$t('el.tree.emptyText');
        }
      },
      showCheckbox: {
        type: Boolean,
        default: false
      },
      showCheckRadio: {
        type: Boolean,
        default: false
      },
      showCheckRadioMultiple: {
        type: Boolean,
        default: false
      },
      getStatusClass: Function,
      // tree初始选中/选择的值
      defaultKeys: Array
    },
    data () {
      return {
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        treeData: this.data,
        // 搜索框筛选值
        filterText: '',
        currentNodeKey: '',
        selectedVal: '',
        defaultExpendedKeys: [],
        // tree的选中值，为Object/array
        value: '',
        selectedMultipleVal: {} // 每个node的level为1的节点各有一个val
      }
    },
    watch: {
      data (val) {
        this.treeData = val
      },
      /**
       * 筛选基于data做变化，而非根据tree的filter
       */
      filterText (val) {
        this.$refs[this.treeRef].filter(val)
        this.treeData = this.getTreeData(this.data, val)
      },
      value (newVal, oldVar) {
        this.$emit('input', newVal)
      },
      defaultKeys (val) {
        this.setDefaultKeys(val)
      }
    },
    mounted () {
      this.setDefaultKeys(this.defaultKeys);
      if (this.showCheckRadioMultiple) {
        this.getTreeMultipleModel(this.treeData)
      }
    },
    methods: {
      getTreeMultipleModel (treeData) {
        if (!treeData) {
          return null;
        }
        treeData.map(node => {
          // 仅仅遍历一层，不考虑多层情况
          this.selectedMultipleVal[node.id] = ""
        })
      },
      getFirstParent (node) {
        console.log(this.selectedMultipleVal)
        return node.level !== 1 ? this.getFirstParent(node.parent) : node.data.id
      },
      /**
       * 阻止description下的click触发select的click
       */
      pauseEvent,
      /**
       * 树节点的筛选，输入关键字，即使父节点没有，但子节点含有，父节点任然要返回
       * @param treeData 树结构
       * @param 搜索关键字
       * @return [] 筛选之后的树结构
       */
      getTreeData (treeData, value) {
        if (!treeData) {
          return null;
        }
        let newTreeData = [];
        let children = null;
        treeData.map(node => {
          if (node.children) {
            children = node.children;
          }
          if (node.label.indexOf(value) > -1) {
            newTreeData.push(node)
          } else {
            if (children) {
              let newNodes = this.getTreeData(node.children, value);
              let obj = {
                ...node,
                children: newNodes
              }
              if (newNodes && newNodes.length > 0) {
                newTreeData.push(obj)
              }
            }
          }
        })
        return newTreeData
      },
      /**
       * 提供通过key和node设置默认值的入口。必须位于tree中，外部设置不生效
       * keys 类型为Array
       */
      setDefaultKeys (keys) {
        if (keys instanceof Array) {
          if (this.showCheckbox) { // tree为复选框
            this.$refs[this.treeRef].setCheckedKeys(keys)
            // 设置默认展开
            if (keys.length !== 0) {
              this.defaultExpendedKeys = this.$refs[this.treeRef].getHalfCheckedKeys()
            } else {
              this.defaultExpendedKeys = []
            }
            // 设置v-model的值
            this.value = this.$refs[this.treeRef].getCheckedNodes()
          } else if (this.showCheckRadio) { // tree为单选
            if (keys.length === 0) { // 单选清除
              this.selectedVal = '';
              this.value = {}
              this.defaultExpendedKeys = []
              return;
            }
            this.defaultExpendedKeys = keys
            for (let node of this.data) { // 默认传入的为key，需要的为label值
              this.getNodes(node, keys)
            }
          } else {
            if (keys.length !== 0) { // tree为普通树
              // 不考虑列表中多个key的情况
              this.$refs[this.treeRef].setCurrentKey(keys[0])
              this.defaultExpendedKeys = keys
            } else {
              // 取消当前高亮的节点
              this.defaultExpendedKeys = []
              this.$refs[this.treeRef].setCurrentKey(null)
            }
          }
        }
      },
      /**
       * tree通过key获取label
       */
      getNodes (node, keys) {
        if (keys.includes(node.id)) {
          this.selectedVal = node.label
          this.value = node
        }
        if (node.children !== null && node.children instanceof Array) {
          for (let child of node.children) {
            this.getNodes(child, keys)
          }
        }
      },
      /**
       * 获取选中状态的node
       * @return getCheckedNodes
       */
      getCheckedNodes () {
        return this.$refs[this.treeRef].getCheckedNodes();
      },
      /**
       * 获取选中状态的keys
       * @return getCheckedKeys
       */
      getCheckedKeys () {
        return this.$refs[this.treeRef].getCheckedKeys();
      },
      /**
       * 复选框被点击时触发
       * @param node
       * @param data
       */
      check (node, data) {
        if (this.showCheckbox) {
          this.value = this.getCheckedNodes();
          this.$emit('check', node, data);
        }
      },
      /**
       * tree筛选事件
       * @param value
       * @param data
       */
      filterNode (value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      },
      /**
       * 除复选的节点点击事件
       * @param data
       * @param node
       * @param tree
       */
      handleNodeClick (data, node, tree) {
        if (this.showCheckRadioMultiple) {
          this.value = Object.values(this.selectedMultipleVal).filter(s => { return s && s.trim() })
          this.$emit("node-click", data, node, tree)
        } else if (!this.showCheckbox) {
          this.value = data
          this.$emit("node-click", data, node, tree)
        }
      }
    }
  }
</script>
