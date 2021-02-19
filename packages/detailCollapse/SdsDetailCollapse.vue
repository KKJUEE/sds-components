<template>
  <div class="sds-detail-collapse" :class="[{'is-show': !collapse}]">
    <span class="sds-detail-collapse-title" @click="handleClickTitle">
      <slot name="title">
        {{title}}
      </slot>
      <i class="fa fa-angle-down sds-detail-collapse-arrow"></i>
    </span>
    <el-collapse-transition>
      <div class="sds-detail-collapse-content"
        v-show="!collapse">
        <div class="sds-detail-collapse-scroll"
           :style="[{maxHeight}]"
           v-scrollbar="scrollbar">
          <slot></slot>
        </div>
      </div>
    </el-collapse-transition>
  </div>
</template>

<script>

  export default {
    name: "sds-detail-collapse",
    props: {
      title: String,
      defaultCollapse: {
        type: Boolean,
        default: true,
      },
      maxHeight: String
    },
    data () {
      return {
        collapse: this.defaultCollapse,
        scrollbar: false
      }
    },
    methods: {
      handleClickTitle () {
        this.collapse = !this.collapse;
      },
    },
    mounted () {
      this.$nextTick(() => {
        this.scrollbar = true
      })
    },
  }
</script>
