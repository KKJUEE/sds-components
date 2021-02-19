<template>
  <div class="sds-pagination">
    {{pageVo}}
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :page-sizes="config.pagesizes"
      :background="config.background"
      :pager-count="config.pagerCount"
      :layout="config.layout"
      :disabled="config.disabled"
      :small="config.small"
      :class="{'sds-pagination__hidden': config.hiddenNext}"

      :current-page="pageVo.currentPage"
      :page-size="pageVo.pagesize"
      :total="pageVo.total">
        <span>
          <span class="el-pagination__total sds-pagination__total">
            {{$t(`components.table_pagination_record${pageVo.total>1?'s':''}`)}}
          </span>
          <span class="el-pagination__total sds-pagination__total">
            {{$t('components.table_pagination_order')}}{{pageVo.currentPage}} / {{pageVo.total}}{{$t('components.table_pagination_pageClassifier')}}
          </span>
        </span>
    </el-pagination>
  </div>
</template>

<script>
  export default {
    inheritAttrs: false,
    name: "sds-pagination",
    data () {
      return {
        userInput: null,
        configDefault: {
          pagesizes: [10, 20, 30, 40],
          pagerCount: 5,
          background: true,
          layout: "total, slot, jumper, sizes, next, pager, prev",
          popperClass: '',
          disabled: false,
          small: false,
          hiddenPrev: false,
          hiddenNext: false
        },
        configOptions: [
          'pagesizes',
          'pagerCount',
          'background',
          'layout',
          'popperClass',
          'disabled',
          'small',
          'hiddenPrev',
          'hiddenNext'
        ],
        config: {}
      }
    },
    props: {
      pageVo: {
        type: Object,
        default: () => {
          return {
            total: 0,
            pagesize: 10,
            currentPage: 1
          }
        }
      },
      pageConfig: {
        type: Object,
        default: () => {
          return {}
        }
      }
    },
    methods: {
      handleSizeChange (val) {
        let page = {
          ...this.pageVo,
          pagesize: val
        };
        this.$emit('page-change', page);
      },
      handleCurrentChange (val) {
        let page = {
          ...this.pageVo,
          currentPage: val
        };
        this.$emit('page-change', page);
      },
    },
    created () {
      for (let item of this.configOptions) {
        if (!this.pageConfig.hasOwnProperty(item)) {
          this.config[item] = this.configDefault[item]
        } else {
          this.config[item] = this.pageConfig[item]
        }
      }
    }
  }
</script>
