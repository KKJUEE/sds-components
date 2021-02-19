<template>
  <el-popover
    popper-class="sds-screen-column"
    placement="bottom-end"
    v-model="showPopover"
    @hide="screenColumn"
    @show="originColumn = [...checkedColumns]"
  >
    <div class="sds-screen-column__content">
      <el-checkbox :indeterminate="!checkAll" v-model="checkAll" @change="handleCheckAll" class="sds-screen-column__header">{{$t('components.table_screencolumn_checkall')}}</el-checkbox>
      <el-checkbox-group v-model="checkedColumns" @change="handleChangeColumn" class="sds-screen-column__checkbox-group">
        <el-checkbox v-for="item in dropItem" :label="item.value" :key="item.value">{{item.label}}</el-checkbox>
      </el-checkbox-group>
    </div>
    <div class="sds-screen-column-bottom">
      <el-button
        type="text"
        @click="handleReset"
        :class="{'is-disabled':checkedColumns.length ===0}"
        :disabled="checkedColumns.length ===0"
      >{{$t('components.table_screencolumn_reset')}}</el-button>
    </div>
    <i class="fa fa-list-ul" :class="{'isactive': showPopover}" slot="reference"></i>
  </el-popover>
</template>

<script>
  import { deepClone } from "../utils/utils";
  export default {
    inheritAttrs: false,
    inject: ['sdsTable'],
    props: {
      dropItem: {
        type: Array,
      },
      screenData: {
        type: Object
      },
    },
    data () {
      return {
        checkAll: false,
        checkedColumns: [],
        showPopover: false,
        overViewColumns: [],
        commonColumns: [],
        performanceColumns: []
      }
    },
    created () {
      this.allColumnsProp = deepClone(this.screenData.allColumns.map(v => v.prop))
      this.checkedColumns = this.screenData.checkedColumns
      for (let item of this.screenData.allColumns) {
        if (!item.locked && item.label && !item.hidden) {
          if (!item.hasOwnProperty('viewBy')) {
            this.commonColumns.push(item.prop)
          } else {
            if (item.viewBy === 'overview') {
              this.overViewColumns.push(item.prop)
            } else if (item.viewBy === 'performance') {
              this.performanceColumns.push(item.prop)
            }
          }
        }
      }
    },
    computed: {
      originColumns () {
        return this.screenData.originColumns
      }
    },
    watch: {
      checkedColumns () {
        this.checkAll = this.checkedColumns.length === this.dropItem.length
      },
    },
    methods: {
      handleReset () {
        let viewBy = this.sdsTable.viewBy
        this.checkedColumns = viewBy === 'overview' ? deepClone(this.performanceColumns) : deepClone(this.overViewColumns)
      },
      screenColumn () {
        this.showPopover = false;
        this.$emit('hide', { checkedColumns: this.checkedColumns })
      },
      handleCheckAll (value) {
        let viewBy = this.sdsTable.viewBy
        if (value) {
          if (viewBy === 'overview') {
            let list = this.performanceColumns.reduce((accu, next) => {
              this.checkedColumns.includes(next) && accu.push(next)
              return accu
            }, [])
            this.checkedColumns = this.commonColumns.concat(this.overViewColumns).concat(list)
          } else {
            let list = this.overViewColumns.reduce((accu, next) => {
              this.checkedColumns.includes(next) && accu.push(next)
              return accu
            }, [])
            this.checkedColumns = this.commonColumns.concat(list).concat(this.performanceColumns)
          }
        } else {
          this.checkedColumns = viewBy === 'overview' ? deepClone(this.performanceColumns) : deepClone(this.overViewColumns)
        }
        this.$emit('hide', { checkedColumns: this.checkedColumns })
      },
      handleChangeColumn (value) {
        this.checkAll = this.checkedColumns.length === this.dropItem.length
      }
    }
  }
</script>

<style>
</style>
