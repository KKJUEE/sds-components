<template>
  <div class="sds-result" ref="result">
    <div class="operate-status-icon operate-status-icon-success" :class="customClass">
      <slot name="icon">
        <span><i class="fa fa-check" :class="iconClass"></i></span>
      </slot>
    </div>
    <p class="operate-status-title">{{title}}</p>
    <p class="operate-status-subTitle">{{description}}</p>
    <div class="operate-success__body">
        <div class="operate-success-info">
          <slot></slot>
        </div>
    </div>
    <slot name="button"></slot>
  </div>
</template>

<script>
  export default {
    name: "sdsResult",
    data () {
      return {}
    },
    props: {
      customClass: String,
      iconClass: String,
      title: String,
      description: String
    }
  }
</script>
