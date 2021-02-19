<template>
    <svg class="sds-icon sds-svg-icon" v-if="svg">
      <use :xlink:href="computedIcon"></use>
    </svg>
    <i class="sds-icon" :class="[computedIcon, iconFamily]"  v-else></i>
</template>

<script>
  export default {
    name: "sds-icon",
    props: {
      icon: {
        type: String,
        required: true
      },
      svg: Boolean
    },
    computed: {
      computedIcon () {
        if (this.svg) {
          return `#icon-${this.icon}`;
        }
        if (this.icon.indexOf("sds-") === 0) {
          return `icon-${this.icon}`;
        }
        return `fa-${this.icon}`;
      },
      iconFamily () {
        if (this.icon.indexOf("sds-") === 0) {
          return "iconfont";
        }
        return "fa";
      }
    }
  }
</script>
