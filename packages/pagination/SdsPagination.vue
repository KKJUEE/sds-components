<template>
  <el-pagination class="sds-pagination"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    v-bind="{...defaultConfig, ...$attrs}"
    v-on="$listeners">
    <span>
      <span class="el-pagination__total sds-pagination__total">
        {{$t(`components.table_pagination_record${$attrs.total>1?'s':''}`)}}
      </span>
      <span class="el-pagination__total sds-pagination__total">
        {{$t('components.table_pagination_order')}}
        {{$attrs.currentPage||defaultConfig.currentPage}} /
        {{Math.ceil(($attrs.total||defaultConfig.total)/($attrs.pageSize||defaultConfig.pageSize))}}
        {{$t('components.table_pagination_pageClassifier')}}
      </span>
    </span>
  </el-pagination>
</template>

<script>
  export default {
    inheritAttrs: false,
    name: "sds-pagination",
    data () {
      return {
        defaultConfig: {
          total: 0,
          currentPage: 1,
          pageSize: 10,
          pageSizes: [10, 30, 50, 100],
          pagerCount: 5,
          background: true,
          layout: "total, slot, jumper, sizes, next, pager, prev",
          popperClass: '',
          disabled: false,
          small: false,
        },
      }
    },
    methods: {
      handleSizeChange (val) {
        const page = {
          currentPage: this.$attrs.currentPage,
          pageSize: val,
          total: this.$attrs.total
        };
        this.$emit('page-change', page);
      },
      handleCurrentChange (val) {
        const page = {
          currentPage: val,
          pageSize: this.$attrs.pageSize,
          total: this.$attrs.total
        };
        this.$emit('page-change', page);
      },
    },
  }
</script>
