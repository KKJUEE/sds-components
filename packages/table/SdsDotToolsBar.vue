<template>
  <el-dropdown trigger="click" class="sds-dot-tools" size="medium"
    placement="bottom-start"
    @command="handleAction"
    @visible-change="handleVisibleChange">
    <el-button type="text"
       class="sds-dot-tools--text"
       :class="{'is-active': visible}"
       icon="fa fa-ellipsis-h">
    </el-button>
    <el-dropdown-menu slot="dropdown"  class="sds-dot-tools-menu">
      <slot>
        <el-dropdown-item
          v-for="item in dotActionTools"
          :key="item.value"
          :command="item.value">
          {{item.label}}
        </el-dropdown-item>
      </slot>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
  export default {
    inheritAttrs: false,
    props: {
      dotActionTools: Array,
      currentRow: {
        type: Object,
        required: true
      },
      index: String
    },
    data () {
      return {
        visible: false
      }
    },
    methods: {
      handleAction (command) {
        this.$emit('sds-dot-command', command, this.currentRow);
      },
      handleVisibleChange (visible) {
        this.visible = visible;
        this.$emit('dot-tool-visible-change', visible, this.index)
      }
    },
  }
</script>
