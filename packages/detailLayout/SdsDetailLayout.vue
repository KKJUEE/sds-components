<template>
  <div class="sds-detail" v-loading="loading">
    <div class="sds-detail-header" v-if="$slots.title || $slots.buttons">
      <div class="sds-detail-title" v-if="$slots.title">
        <img :src="detailInfoImg" class="sds-detail-info-img"/>
        <slot name="title"></slot>
      </div>
      <div v-if="$slots.buttons" class="sds-detail-buttons">
        <slot name="buttons"></slot>
      </div>
    </div>
    <div class="sds-detail-params">
      <slot></slot>
    </div>
    <slot name="tabs"></slot>
    <div v-if="loadingFailure" class="sds-detail-loading-failure">
      <div class="sds-detail-loading-failure-content">
        <div class="sds-detail-loading-failure-text">{{$t("components.detail_failureText")}}</div>
        <el-button type="text" @click="handleRefreshClick">{{$t("components.detail_refresh")}}</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  import detailInfoImg from '../assets/images/detail-info.png';

  export default {
    name: "sds-detail-layout",
    props: {
      requestApi: Function,
      requestNamesApi: Function,
      enableCache: Boolean
    },
    data () {
      return {
        loading: true,
        loadingFailure: false,
        selectedValCache: null,
        detailInfoImg
      }
    },
    created () {
      this.request();
      this.$eventBus.$on("breadcrumb-select-change", this.request);
      this.$eventBus.$emit("request-names-api", this.requestNamesApi, this.enableCache);
    },
    beforeDestroy () {
      this.$eventBus.$off("breadcrumb-select-change", this.request);
    },
    methods: {
      request (selectedVal) {
        if (typeof this.requestApi !== "function") {
          return;
        }
        this.selectedValCache = selectedVal;
        this.loadingFailure = false;
        this.loading = true;
        this.requestApi(selectedVal)
          .catch(() => {
            this.loadingFailure = true;
          })
          .finally(() => {
            this.loading = false;
          })
      },
      handleRefreshClick () {
        this.request(this.selectedValCache);
      }
    }
  }
</script>
