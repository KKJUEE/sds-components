<template>
  <div :class="[
    'sds-base-set-item',
    isActive ? 'is-active' : '',
    baseSet.accrdion ? 'sds-base-set-item--accrdion': '']">
    <div class="sds-base-set-item__header">
      <div class="sds-base-set-item__header-title">
        {{title}}
        <el-tooltip placement="right" v-if="tooltip" :content="tooltip">
          <i class="fa fa-info-circle"></i>
        </el-tooltip>
      </div>
      <div class="sds-base-set-item__header-button">
        <slot name="headerBtn">
          <el-button type="text" @click="emitClick">{{buttonText}}</el-button>
        </slot>
      </div>
    </div>
    <div class="sds-base-set-item__description" v-show="!isActive">
      <div v-if="!$slots.description&&description">{{description}}</div>
      <slot name="description" v-if="$slots.description&&!description"></slot>
    </div>
    <div class="sds-base-set-item__content" v-show="isActive">
      <div class="sds-base-set-item__content-body">
        <slot name="content"></slot>
      </div>
      <div class="sds-base-set-item__content-button" :style="{marginLeft: labelWidth}" v-if="operator">
        <el-button @click="emitUnsaveItem">{{this.$t('components.base_set_cancel') }}</el-button>
        <el-button type="primary" @click="emitSaveItem">{{this.$t('components.base_set_save') }}</el-button>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    inject: ['baseSet'],
    name: "sds-base-set-item",
    componentName: 'BaseSetItem',
    props: {
      operator: {
        type: Boolean,
        default: true
      },
      title: {
        type: String,
        required: true
      },
      name: {
        type: String,
        required: true
      },
      tooltip: {
        type: String,
      },
      formData: {
        type: Object
      },
      labelWidth: {
        type: String,
        default: '0px'
      },
      buttonName: {
        type: String,
        default: 'edit'
      },
      description: String
    },
    data () {
      return {
        initedData: null,
      }
    },
    computed: {
      isUpdated () {
        return JSON.stringify(this.formData) !== this.initedData
      },
      buttonText () {
        return this.isActive ? this.$t('components.base_set_collasp')
          : this.$t(`components.base_set_${this.buttonName}`)
      },
      isActive () {
        return this.baseSet.activeNames.indexOf(this.name) > -1
      },
    },
    methods: {
      emitClick () {
        this.baseSet.handleItemClick(this)
      },
      emitAddItem () {
        this.baseSet.handleAddItem(this)
      },
      emitSaveItem () {
        this.baseSet.handleSave(this)
      },
      emitUnsaveItem () {
        this.baseSet.handleUnSave(this)
      },
      setInitData () {
        this.initedData = JSON.stringify(this.formData)
      }
    },
    created () {
      this.setInitData()
    },
    mounted () {
      this.baseSet.handleAddItem(this)
    },
    beforeDestroy () {
      this.baseSet.handleRemoveItem(this)
    }
  }
</script>
