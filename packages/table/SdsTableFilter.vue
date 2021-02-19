<template>
  <el-popover
    v-model="showPopover"
    popper-class="sds-table-filter"
    placement="bottom-start"
    trigger="click"
  >
    <div class="sds-table-filter__content">
      <el-scrollbar class="sds-scrollbar">
        <el-checkbox-group v-model="filteredValue" class="sds-table-filter__checkbox-group">
          <el-checkbox
            v-for="filter in filterOptions"
            :key="filter.value"
            :label="filter.value"
          >{{filter.text}}</el-checkbox>
        </el-checkbox-group>
      </el-scrollbar>
    </div>
    <div class="sds-table-filter-bottom">
      <el-button
        type="text"
        @click="handlerReset"
        :class="{'is-disabled':filteredValue.length ===0}"
        :disabled="filteredValue.length ===0"
      >{{$t('components.table_filter_reset')}}</el-button>
      <el-button
        type="text"
        @click="handleConfirm"
        :class="{'is-disabled':filteredValue.length ===0}"
        :disabled="filteredValue.length ===0"
      >{{$t('components.table_filter_sure')}}</el-button>
    </div>
    <i class="fa fa-filter" :class="{'isactive': showPopover}" slot="reference"></i>
  </el-popover>
</template>

<script>
  export default {
    inheritAttrs: false,
    props: {
      filterOptions: {
        type: Array,
      }
    },
    data () {
      return {
        filteredValue: [],
        showPopover: false
      }
    },
    methods: {
      handlerReset () {
        this.filteredValue = []
      },
      handleConfirm () {
        this.showPopover = false;
        this.$emit('sdsFilterConfirm', this.filteredValue, this.filterOptions);
      },
    },
  }
</script>
