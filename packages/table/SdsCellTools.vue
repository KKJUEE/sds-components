<template>
  <div class="sds-cell-tools">
    <el-button type="text" @click="handleCellAction(op)" :class="op.className" v-for="(op, idx) in baseList" :key="op.handle">{{op.name}}<span class="sds-cell-tools--line" v-if="idx < baseList.length-1">|</span></el-button>
    <el-dropdown trigger="click"  v-if="moreList.length">
      <el-button type="text" class="sds-dropdown-link">{{$t('components.table_celltools_more')}}<i class="el-icon-arrow-down el-icon--right"></i></el-button>
      <el-dropdown-menu slot="dropdown" class="operation-dropdown">
        <el-dropdown-item v-for="op in moreList" :key="op.handle">
          <el-button type="text" @click="handleCellAction(op)" >{{op.name}}</el-button>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
  export default {
    inheritAttrs: false,
    props: {
      cellActionTools: {
        type: Array,
      },
      currentRow: {
        type: Object,
        required: true
      },
    },
    computed: {
      currentTools () {
        return this.cellActionTools ? this.cellActionTools : [
          {
            name: this.$t('components.table_celltools_cancel'),
            handle: 'cancel',
            show: true,
            className: 'is_default'
          },
          {
            name: this.$t('components.table_celltools_sure'),
            handle: 'sure',
            show: true,
          },
        ]
      },
      allList () {
        return this.currentTools.filter(o => typeof o.show === 'function' ? o.show() : o.show)
      },
      baseList () {
        return this.allList.length <= 3 ? this.allList.slice(0, 3) : this.allList.slice(0, 2)
      },
      moreList () {
        return this.allList.length <= 3 ? this.allList.slice(3) : this.allList.slice(2)
      }
    },
    methods: {
      handleCellAction (op) {
        this.$emit('handleCellAction', this.currentRow, op)
      }
    }
  }
</script>
