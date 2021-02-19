<template>
  <el-popover
    popper-class="sds-screen-column"
    placement="bottom-end"
    v-model="showPopover"
    @hide="screenColumn">
    <div class="sds-screen-column__content">
      <el-checkbox :indeterminate="!checkAll" v-model="checkAll"
        @change="handleCheckAll"
        class="sds-screen-column__header">
        {{$t('components.table_screencolumn_checkall')}}
      </el-checkbox>
      <el-checkbox-group v-model="currentCheckedColumns"
        class="sds-screen-column__checkbox-group">
        <el-checkbox v-for="item in dropItems"
          :value="item.value"
          :label="item.value"
          :key="item.value">
          {{item.label}}
        </el-checkbox>
      </el-checkbox-group>
    </div>
    <div class="sds-screen-column-bottom">
      <el-button
        type="text"
        @click="handleReset"
        :class="{'is-disabled':currentCheckedColumns.length ===0}"
        :disabled="currentCheckedColumns.length ===0">
        {{$t('components.table_screencolumn_reset')}}
      </el-button>
    </div>
    <i class="fa fa-list-ul" :class="{'is-active': showPopover}" slot="reference"></i>
  </el-popover>
</template>

<script>
  export default {
    inheritAttrs: false,
    inject: ['sdsTable'],
    props: {
      dropItems: Array,
      checkedColumns: Array
    },
    data () {
      return {
        checkAll: false,
        showPopover: false,
        currentCheckedColumns: this.checkedColumns
      }
    },
    watch: {
      checkedColumns (val) {
        this.currentCheckedColumns = val;
      },
      currentCheckedColumns: {
        immediate: true,
        handler (val) {
          this.checkAll = val.length === this.dropItems.length;
        }
      },
    },
    methods: {
      handleReset () {
        this.currentCheckedColumns = [];
      },
      screenColumn () {
        this.showPopover = false;
        this.$emit('hide', this.currentCheckedColumns);
      },
      handleCheckAll (value) {
        this.currentCheckedColumns = value ? this.dropItems.map(item => {
          return item.value;
        }) : [];
      }
    }
  }
</script>
