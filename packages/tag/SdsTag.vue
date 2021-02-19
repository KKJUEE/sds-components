<template>
  <span class="sds-dot-tag"
    v-if="dot"
    :class="{['sds-dot-tag-'+$attrs.type]: $attrs.type}">
    &nbsp;
    <slot></slot>
  </span>
  <el-tag class="sds-tag"
    :class="[{transparent}]"
    v-bind="$attrs"
    v-on="$listeners"
    v-else>
    <slot></slot>
  </el-tag>
</template>

<script>
  export default {
    name: "sds-tag",
    props: {
      dot: Boolean,
      transparent: Boolean
    },
  }
</script>
