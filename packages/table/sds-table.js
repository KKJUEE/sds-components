export default {
  computed: {
    langForCreate () {
      return this.$t("components.table_tip_adding")
    },
    vm () {
      return this;
    },
    paginationData () {
      let data = [];
      const pagination = this.currentPagination;
      switch (this.mode) {
      case "multy":
        data = this.data;
        break;
      case "once":
        data = this.data.slice(
          (pagination.currentPage - 1) * pagination.pageSize,
          pagination.currentPage * pagination.pagesize
        );
        break;
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
    pagination: Object,
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
          createInProgress: 0
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
    accumulateIndex: {
      type: Boolean,
      default: true
    },
    // 更多
    showScreen: {
      type: Boolean,
      default: false
    },
    columnOptions: Array
  },
  methods: {
    generateIndex (index) {
      const pagination = this.currentPagination;
      return (pagination.currentPage - 1) * pagination.pageSize + index + 1;
    },
  }
}
