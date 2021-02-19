<template>
  <el-tooltip
    :content="clipboardTooltip"
    :visible-arrow="false"
    :key="clipboardTooltip"
    placement="top">
    <span class="sds-clipboard-copy"
      v-clipboard:copy="copyContent"
      v-clipboard:success="clipboardSuccess"
      :class="[{clipboarded}]">
      <slot>
        <i class="fa" :class="[clipboardIcon]"></i>
      </slot>
    </span>
  </el-tooltip>
</template>

<script>
  export default {
    name: "sds-clipboard-copy",
    props: {
      copyContent: {
        typed: String,
        required: true
      }
    },
    data () {
      return {
        clipboarded: false
      }
    },
    computed: {
      clipboardIcon () {
        return this.clipboarded ? "fa-check" : "fa-files-o";
      },
      clipboardTooltip () {
        return this.clipboarded ? this.$t("components.clipboard_copy_success") : this.$t("components.clipboard_copy");
      }
    },
    methods: {
      clipboardSuccess () {
        if (this.clipboarded) {
          return;
        }
        this.clipboarded = true;
        setTimeout(() => {
          this.clipboarded = false;
        }, 2000);
        this.$emit("sds-clipboard-copy-success");
      }
    }
  }
</script>
