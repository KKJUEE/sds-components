export default {
  computed: {
    pageVo: {
      get () {
        return {
          total: this.tableConfig.total || 0,
          pagesize: this.tableConfig.pagesize || 10,
          currentPage: this.tableConfig.currentPage || 1
        };
      },
      set (val) {
        for (const attr in val) {
          this.tableConfig[attr] = val[attr];
        }
      }
    },
    langForCreate () {
      return this.$t("components.table_tip_adding")
    },
    vm () {
      return this;
    },
    paginationMode () {
      let data;
      switch (this.mode) {
      case "multy":
        data = this.data;
        break
      case "once":
        data = this.data.slice(
          (this.tableConfig.currentPage - 1) * this.tableConfig.pagesize,
          this.tableConfig.currentPage * this.tableConfig.pagesize
        );
        break
      }
      return data
    }
  },
  props: {
    // 分页模式
    mode: {
      type: String,
      default: "multy"
    },
    pageConfig: {
      type: Object,
      default: () => {
        return {
          pagesizes: [10, 50, 100, 200]
        };
      }
    },
    keysForStatus: {
      type: String,
      default: 'status'
    },
    showPagination: {
      type: Boolean,
      default: true
    },
    // 表格
    tableConfig: {
      type: Object,
      default: () => {
        return {
          loading: false,
          columnOptions: "",
          total: 0,
          createInProgress: 0,
          pagesize: 10,
          currentPage: 1,
        };
      }
    },
    data: {
      type: Array,
      required: true
    },
    showActionBar: {
      type: Boolean,
      default: false
    },
    showCellTools: {
      type: Boolean,
      default: false
    },
    showSelect: {
      type: Boolean,
      default: false
    },
    showIndex: {
      type: Boolean,
      default: false
    },
    // 累加索引
    AccumulateIndex: {
      type: Boolean,
      default: true
    },
    // 更多
    showScreen: {
      type: Boolean,
      default: false
    },
  },
  methods: {
    indexMethod (index) {
      return (this.pageVo.currentPage - 1) * this.pageVo.pagesize + index + 1;
    },
  }
}
