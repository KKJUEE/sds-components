<template>
  <el-steps v-bind="$attrs" simple finish-status="success">
    <el-step v-for="(step, index) in stepList" :key="step" :title="step">
      <span slot="icon">{{index + 1}}</span>
    </el-step>
  </el-steps>
</template>

<script>
  export default {
    name: 'sds-steps',
    props: {
      stepList: {
        type: Array
      }
    }
  }
</script>
