<template>
  <el-dropdown trigger="click" class="sds-dot-tools" size="medium" placement="bottom-start" @command="handleAction" @visible-change="handleVisibleChange">
    <el-button type="text" :class="{'sds-dot-tools--text':true, isactive:dotToolShow}" icon="fa fa-ellipsis-h"></el-button>
    <el-dropdown-menu slot="dropdown"  class="sds-dot-tools-menu">
      <el-dropdown-item
        v-for="item in dotActionTools"
        :key="item.value"
        :command="item.value"
      >{{item.label}}</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
  export default {
    inheritAttrs: false,
    props: {
      dotActionTools: {
        type: Array,
        required: true
      },
      currentRow: {
        type: Object,
        required: true
      },
      dotToolShow: {
        type: Boolean,
      }
    },
    methods: {
      handleAction (command) {
        this.$emit('sds-dot-command', command, this.currentRow);
      },
      handleVisibleChange (bool) {
        this.$emit('updateDotToolShow', bool)
      }
    },
  }
</script>

<style scoped>
</style>
