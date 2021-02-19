<template>
  <el-row class="sds-action-bar" type="flex" justify="space-around">
    <el-col :span="12" class="sds-button-group">
      <slot name="leftBar"></slot>
    </el-col>
    <el-col :span="12" class="sds-addtional-bar">
      <div class="sds-addtional-bar__body">
        <slot name="rightBar">
        </slot>
        <el-button icon="fa fa-refresh" class="sds-addtional-bar__button--fresh" @click="handleAction('fresh')" v-if="showFresh"></el-button>
        <el-input size="small" style="width: unset" v-if="showSearch" :placeholder="searchPlaceHolder" v-model="searchValue" @keyup.enter.native="handleAction('search')">
          <i slot="prefix" class="el-input__icon el-icon-search" @click="handleAction('search')"></i>
        </el-input>
        <el-button-group class="sds-addtional-bar__btngroup" v-if="showSwitch">
            <el-button size="small" :class="{isactive:viewBy==='overview'}" @click="handleAction('overview')">{{$t('components.table_btngroup_overview')}}</el-button>
            <el-button size="small" :class="{isactive:viewBy==='performance'}" @click="handleAction('performance')">{{$t('components.table_btngroup_performance')}}</el-button>
        </el-button-group>
    </div>
    </el-col>
  </el-row>
</template>

<script>
  export default {
    inheritAttrs: false,
    name: "SdsActionBar",
    data () {
      return {
        searchValue: ''
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
      searchPlaceHolder: {
        type: String,
        default: ''
      },
      viewBy: {
        type: String,
        default: 'overview'
      }
    },
    methods: {
      handleAction (type) {
        this.$emit(type, this.searchValue)
      },
    },
  }
</script>
