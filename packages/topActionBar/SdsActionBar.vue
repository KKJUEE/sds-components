<template>
  <div class="sds-action-bar">
    <div class="sds-action-bar-left" v-if="$slots.leftBar">
      <slot name="leftBar"></slot>
    </div>
    <div class="sds-action-bar-right">
      <slot name="rightBar">
      </slot>
      <el-button icon="fa fa-refresh"
        class="sds-action-bar-right-fresh-btn"
        @click="handleAction('fresh')"
        v-if="showFresh">
      </el-button>
      <el-input size="small" style="width: unset" v-if="showSearch"
        :placeholder="searchPlaceholder"
        v-model="searchValue"
        @keyup.enter.native="handleAction('search')">
        <i slot="prefix" class="el-input__icon el-icon-search" @click="handleAction('search')"></i>
      </el-input>
      <el-radio-group v-if="showSwitch"
        size="small"
        v-model="activeView"
        class="sds-action-bar-right-radio-group">
        <el-radio-button label="overview">
          {{$t('components.table_btngroup_overview')}}
        </el-radio-button>
        <el-radio-button label="performance">
          {{$t('components.table_btngroup_performance')}}
        </el-radio-button>
      </el-radio-group>
    </div>
  </div>
</template>

<script>
  export default {
    inheritAttrs: false,
    name: "SdsActionBar",
    data () {
      return {
        searchValue: '',
        activeView: this.defaultView
      }
    },
    props: {
      showFresh: {
        type: Boolean,
        default: true
      },
      showSearch: {
        type: Boolean,
        default: true
      },
      showSwitch: {
        type: Boolean,
        default: true
      },
      searchPlaceholder: {
        type: String,
        default: ''
      },
      defaultView: {
        type: String,
        default: 'overview'
      }
    },
    watch: {
      defaultView (val) {
        this.activeView = val;
      },
      activeView (val) {
        this.$emit("active-view-change", val);
      }
    },
    methods: {
      handleAction (type) {
        this.$emit(type, this.searchValue)
      },
    },
  }
</script>
