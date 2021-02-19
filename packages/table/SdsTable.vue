<template>
  <div class="sds-table" v-loading="tableConfig.loading">
    <!--表格上方操作栏-->
    <sds-action-bar
      v-bind="$attrs"
      v-if="showActionBar"
      @fresh="$emit('fresh')"
      @search="val => $emit('search', val)"
      :default-view="viewBy"
      @active-view-change="viewBy=$event">
      <template slot="leftBar">
        <slot name="leftBar"></slot>
      </template>
      <template slot="rightBar">
        <slot name="rightBar"></slot>
      </template>
    </sds-action-bar>
    <!--表格主体-->
    <el-table
      v-sds-empty-row="{
        createNumber: defaultCreateNum,
        lang: $i18n.locale,
        langForCreate
      }"
      v-bind="$attrs"
      v-on="$listeners"
      ref="sds-table"
      :data="paginationData"
      :row-class-name="bindRowName">
      <!--empty-->
      <template slot="empty" v-if="!tableConfig.loading">
        <sds-empty></sds-empty>
      </template>
      <!--index or selection-->
      <el-table-column v-for="column in defaultColumns"
        v-bind="column"
        :key="column.type">
      </el-table-column>
      <template v-for="(column, index) in currentColumnOptions">
        <el-table-column
          :key="column.prop || column.label || index"
          v-if="column.show && column.showScreen"
          v-bind="Object.assign({}, defaultColumnConfig, column)">
          <!--自定义header-->
          <template slot="header" slot-scope="scope">
            <!--通过render渲染-->
            <extend
              :render="column.renderHead"
              type="header"
              :params="scope"
              :column="column"
              :vm="vm"
              v-if="column.renderHead"
            >
              <sds-table-filter
                v-if="column.filter"
                :filter-options="column.filterOptions || getFilterDataFromCurPage(column)"
                v-on="$listeners"
              ></sds-table-filter>
            </extend>
            <!--通过具名插槽渲染-->
            <template v-else>
              <span
                :class="{
                  'sds-table-column-filter': column.filter,
                  'sds-thead-tools': true
                }">
                <!--插槽-->
                <slot :name="column.slotHeaderName"
                  :scope="scope">
                  <span>{{ column.label }}</span>
                </slot>
                <!--表格列筛选-->
                <sds-table-filter
                  v-if="column.filter"
                  :filter-options="column.filterOptions || getFilterDataFromCurPage(column)"
                  v-on="$listeners">
                </sds-table-filter>
              </span>
            </template>
          </template>
          <!--自定义body-->
          <template slot-scope="scope">
            <span class="sds-table-column__body"
              :class="{
                'sds-table-cell--active': dotMap[`${scope.$index}-${index}`] &&
                  dotMap[`${scope.$index}-${index}`].dotShow
              }"
              v-dot-cell-mouse="{
                index: `${scope.$index}-${index}`,
                column,
                enterHandler: showDotTools,
                leaveHandler: hideDotTools
              }">
              <!--通过render渲染-->
              <extend
                :render="column.renderBody"
                :params="scope"
                :column="column"
                :vm="vm"
                v-if="column.renderBody">
              </extend>
              <template v-else>
                <!--插槽列-->
                <slot
                  :name="column.slotBodyName"
                  :scope="isExpand(scope, column)">
                  <span class="sds-table-column__cell">
                    {{renderCell(scope.row, scope.column, column)}}
                  </span>
                </slot>
              </template>
              <sds-dot-tools-bar
                v-if="column.showDotToolsBar"
                v-bind="$attrs"
                v-on="$listeners"
                @dot-tool-visible-change="handleDotToolVisibleChange"
                :current-row="scope.row"
                :index="`${scope.$index}-${index}`">
                <slot name="dotTool"></slot>
              </sds-dot-tools-bar>
            </span>
          </template>
        </el-table-column>
      </template>
      <el-table-column
        width="240"
        align="left"
        :label="$t('components.table_column_operation')"
        v-if="showCellTools">
        <template slot-scope="scope">
          <sds-cell-tools
            v-bind="$attrs"
            v-on="$listeners"
            :current-row="scope.row">
          </sds-cell-tools>
        </template>
      </el-table-column>
      <el-table-column width="56" align="center" v-if="showScreen">
        <template slot="header">
          <span class="sds-thead-tools">
            <sds-screen-column
              ref="sds-screen-column"
              :drop-items="dropItems"
              :checked-columns="checkedColumns"
              @hide="hideColumn">
            </sds-screen-column>
          </span>
        </template>
      </el-table-column>
    </el-table>
    <slot name="bottomAction"></slot>
    <sds-pagination v-if="showPagination"
      @page-change="handlePageChange"
      v-bind="pagination">
    </sds-pagination>
  </div>
</template>

<script>
  import SdsDotToolsBar from "./SdsDotToolsBar";
  import SdsTableFilter from "./SdsTableFilter";
  import SdsScreenColumn from "./SdsScreenColumn";
  import Mixin from "../mixins/sds-table.js";
  import { isEmpty, isUnDefined, isEqual } from "../utils/utils";
  import SdsCellTools from "./SdsCellTools";
  import extend from "./extend";
  import { on, off } from "element-ui/lib/utils/dom";

  export default {
    name: "sds-table",
    mixins: [Mixin],
    inheritAttrs: false,
    provide () {
      return {
        sdsTable: this
      }
    },
    computed: {
      defaultCreateNum () {
        const createInProgress = this.tableConfig.createInProgress;
        return isUnDefined(createInProgress) ? null : createInProgress;
      },
      // 默认列配置
      defaultColumns () {
        let defaultColumns = [];
        let index = { label: "#", align: "center", type: "index", width: "48" };
        if (this.accumulateIndex) index.index = this.generateIndex;
        let selection = { align: "center", type: "selection", width: "48" };
        let emptyColumn = { width: "16" };
        this.showIndex && defaultColumns.push(index);
        this.showSelect
          ? defaultColumns.push(selection)
          : defaultColumns.push(emptyColumn);
        return defaultColumns;
      },
      computedColumnOptions () {
        const screenColumnsCache = this.screenColumnsCache || {};
        return this.columnOptions.map(column => {
          // 浅拷贝
          // show: show可通过screen控制显示/不显示列
          // showScreen: showScreen不能通过screen控制显示/不显示列，一般应用于权限
          const viewScreenColumns = screenColumnsCache[column.viewBy || "overview"];
          const show = viewScreenColumns ? this.isShowColumn(column, viewScreenColumns) : true;
          return {
            showScreen: true,
            show: show,
            ...column
          };
        });
      }
    },
    components: {
      SdsDotToolsBar,
      SdsScreenColumn,
      SdsTableFilter,
      SdsCellTools,
      extend
    },
    directives: {
      "dot-cell-mouse": {
        bind (el, binding) {
          const value = binding.value;
          const { column, enterHandler, leaveHandler, index } = value;
          if (!column.showDotToolsBar) {
            return;
          }
          el._mouseenterHandler = (e) => {
            enterHandler(index);
          };
          el._mouseleaveHandler = (e) => {
            leaveHandler(index);
          };
          on(el, "mouseenter", el._mouseenterHandler);
          on(el, "mouseleave", el._mouseleaveHandler);
        },
        unbind (el, binding) {
          const { column } = binding.value;
          if (!column.showDotToolsBar) {
            return;
          }
          off(el, "mouseenter", el._mouseenterHandler);
          off(el, "mouseleave", el._mouseleaveHandler);
          el._mouseleaveHandler = null;
          el._mouseenterHandler = null;
        }
      }
    },
    data () {
      return {
        currentColumnOptions: null,
        dropItems: null,
        checkedColumns: null,
        defaultColumnConfig: {
          width: "",
          showOverflowTooltip: true,
          resizable: true,
          align: "left"
        },
        viewBy: 'overview',
        dotMap: {},
        currentPagination: this.pagination,
      };
    },
    created () {
      this.setCurrentColumns();
    },
    watch: {
      viewBy (val) {
        this.setCurrentColumns();
      },
      pagination (val) {
        this.currentPagination = val;
      },
      computedColumnOptions (val) {
        this.setCurrentColumns();
      },
    },
    methods: {
      setCurrentColumns () {
        this.dropItems = [];
        this.checkedColumns = [];
        this.currentColumnOptions = this.computedColumnOptions.filter(column => {
          const isActiveView = !column.hasOwnProperty('viewBy') || column.viewBy === this.viewBy;
          if (isActiveView && this.showScreen && column.showScreen &&
            !column.locked && column.prop && column.label) {
            this.dropItems.push({ value: column.prop, label: column.label });
            column.show && this.checkedColumns.push(column.prop);
          }
          return isActiveView;
        });
      },
      // 作用域插槽数据
      isExpand (scope, column) {
        if (column.type === "expand") {
          return {
            row: scope.row,
            columnOptions: this.columnOptions
          };
        }
        return { row: scope.row, column: scope.column, columnOption: column };
      },
      // 渲染单元格
      renderCell (row, column, item) {
        if (!column) {
          return;
        }
        if (column.property === item.prop && item.formatter) {
          return isEmpty(item.formatter(row, column.property))
            ? "--"
            : item.formatter(row, column.property);
        }
        return row[column.property];
      },
      bindRowName ({ row, rowIndex }) {
        if (Object.keys(row).length === 0) return;
        const statusVal = row[this.keysForStatus];
        const statusClass = statusVal && statusVal.indexOf("ing") !== -1 ? "sds-row-mask" : "";
        return `${statusClass} sds-row-${statusVal}--${this.$i18n.locale}`;
      },
      // 显示点操作栏
      showDotTools (index) {
        if (!this.dotMap.hasOwnProperty(index)) {
          this.$set(this.dotMap, index, { dotShow: true, dotDropVisible: false });
        }
        this.dotMap[index].dotShow = true;
      },
      // 隐藏点操作栏
      hideDotTools (index) {
        if (this.dotMap[index].dotDropVisible) {
          return;
        }
        this.dotMap[index].dotShow = false;
      },
      handleDotToolVisibleChange (visible, index) {
        this.dotMap[index].dotDropVisible = visible;
        if (!visible) {
          this.hideDotTools(index);
        }
      },
      getFilterDataFromCurPage (column) {
        return [...new Set(this.paginationData.map(v => v[column.prop]))].map(v => {
          return {
            value: v,
            text: v
          }
        });
      },
      hideColumn (checkedColumns) {
        const oldCheckedColumns = this.checkedColumns;
        this.checkedColumns = checkedColumns;
        this.screenColumnsCache = this.screenColumnsCache || {};
        this.screenColumnsCache[this.viewBy] = checkedColumns;
        this.currentColumnOptions.forEach(column => {
          column.show = this.isShowColumn(column, checkedColumns);
        });
        if (!isEqual(checkedColumns, oldCheckedColumns)) {
          this.$emit("checked-columns-change", checkedColumns, this.viewBy);
        }
      },
      isShowColumn (column, checkedColumns) {
        return !column.prop || column.locked || checkedColumns.includes(column.prop);
      },
      handlePageChange (val) {
        this.currentPagination = { ...this.currentPagination, ...val };
        // 转换字段方便外部发送分页请求
        const pageParams = {
          pagenum: val.currentPage,
          pagesize: val.pageSize,
        };
        this.$emit('page-change', pageParams);
      }
    }
  };
</script>
