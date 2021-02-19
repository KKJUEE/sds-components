<template>
  <div class="sds-table" v-loading="tableConfig.loading">
    <!--表格上方操作栏-->
    <sds-action-bar
      v-bind="$attrs"
      v-if="showActionBar"
      :viewBy="viewBy"
      @fresh="$emit('fresh')"
      @search="val => $emit('search', val)"
      @overview="viewBy = 'overview'"
      @performance="viewBy = 'performance'"
      >
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
      :data="paginationMode"
      :row-class-name="bindRowName"
    >
      <!--empty-->
      <template slot="empty" v-if="!tableConfig.loading">
        <sds-empty></sds-empty>
      </template>
      <!--selection-->
      <template
        v-for="(column, index) in defaultColumns().concat(currentColumnOptions)"
      >
        <el-table-column
          v-if="column.type === 'index' || column.type === 'selection'"
          v-bind="column"
          :key="index"
        ></el-table-column>
        <template v-else>
          <el-table-column
            :key="index"
            v-if="!column.hasOwnProperty('show') || (column.hasOwnProperty('show') && column.show)"
            v-bind="Object.assign({}, defaultColumnConfig, column)"
          >
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
                  :filters="column.filterOptions"
                  v-on="$listeners"
                ></sds-table-filter>
              </extend>
              <!--通过具名插槽渲染-->
              <template v-else>
                <span
                  :class="{
                    'sds-table-column-filter': column.filter,
                    'sds-thead-tools': true
                  }"
                >
                  <!--插槽-->
                  <slot
                    :name="column.slotHeaderName"
                    :scope="scope"
                  >
                    <span>{{ column.label }}</span>
                  </slot>
                  <!--表格列筛选-->
                  <sds-table-filter
                    v-if="column.filter"
                    :filterOptions="column.filterOptions"
                    v-on="$listeners"
                  ></sds-table-filter>
                </span>
              </template>
            </template>
            <!--自定义body-->
            <template slot-scope="scope">
              <div>
                <!--  自定义body -->
                <template>
                  <span
                    v-if="column.showDotToolsBar"
                    class="sds-table-column__body"
                    @mouseenter.capture="showDotTools($event, column)"
                    @mouseleave.capture="hideDotTools($event, column)"
                  >
                    <!--通过render渲染-->
                    <extend
                      :render="column.renderBody"
                      :params="scope"
                      :column="column"
                      :vm="vm"
                      v-if="column.renderBody"
                    ></extend>
                    <template v-else>
                      <!--插槽列-->
                      <slot
                        :name="column.slotBodyName"
                        :scope="isExpand(scope, column)"
                      >
                        <span class="sds-table-column__cell">{{
                          renderCell(scope.row, scope.column, column)
                        }}</span>
                      </slot>
                      <template v-if="column.showDotToolsBar">
                        <sds-dot-tools-bar
                          v-bind="$attrs"
                          v-on="$listeners"
                          :dotToolShow="dotToolShow"
                          @updateDotToolShow="updateDotToolShow"
                          :currentRow="scope.row"
                        ></sds-dot-tools-bar>
                      </template>
                    </template>
                  </span>
                  <span
                    v-else
                    class="sds-table-column__body"
                  >
                    <!--通过render渲染-->
                    <extend
                      :render="column.renderBody"
                      :params="scope"
                      :column="column"
                      :vm="vm"
                      v-if="column.renderBody"
                    ></extend>
                    <template v-else>
                      <!--插槽列-->
                      <slot
                        :name="column.slotBodyName"
                        :scope="isExpand(scope, column)"
                      >
                        <span class="sds-table-column__cell">{{
                          renderCell(scope.row, scope.column, column)
                        }}</span>
                      </slot>
                      <template v-if="column.showDotToolsBar">
                        <sds-dot-tools-bar
                          v-bind="$attrs"
                          v-on="$listeners"
                          :dotToolShow="dotToolShow"
                          @updateDotToolShow="updateDotToolShow"
                          :currentRow="scope.row"
                        ></sds-dot-tools-bar>
                      </template>
                    </template>
                  </span>
                </template>
              </div>
            </template>
          </el-table-column>
        </template>
      </template>
      <el-table-column
        width="240"
        align="left"
        :label="$t('components.table_column_operation')"
        v-if="showCellTools"
      >
        <template slot-scope="scope">
          <sds-cell-tools
            v-bind="$attrs"
            v-on="$listeners"
            :currentRow="scope.row"
          ></sds-cell-tools>
        </template>
      </el-table-column>
      <el-table-column width="56" align="center" v-if="showScreen">
        <template slot="header" slot-scope="scope">
          <span class="sds-thead-tools">
            <sds-screen-column
              ref="sds-screen-column"
              :screen-data="{
                checkedColumns,
                originColumns,
                column: scope.column,
                allColumns: columnOptions[tableConfig.dir][tableConfig.columnOptions]
              }"
              :dropItem="dropItem"
              @hide="hideColumn"
            ></sds-screen-column>
          </span>
        </template>
      </el-table-column>
    </el-table>
    <slot name="bottomAction"></slot>
    <sds-pagination
      :pageVo="pageVo"
      :pageConfig="pageConfig"
      @page-change="val => $emit('page-change', val)"
    ></sds-pagination>
  </div>
</template>

<script>
  import columnOptions from "../constants/column-options/index";
  import SdsDotToolsBar from "./SdsDotToolsBar";
  import SdsTableFilter from "./SdsTableFilter";
  import SdsScreenColumn from "./SdsScreenColumn";
  import Mixin from "../mixins/sds-table.js";
  import { isEmpty } from "../utils/utils";
  import SdsCellTools from "./SdsCellTools";
  import extend from "./extend";

  export default {
    name: "sdsTable",
    mixins: [Mixin],
    inheritAttrs: false,
    provide () {
      return {
        sdsTable: this
      }
    },
    computed: {
      defaultCreateNum () {
        return this.tableConfig.hasOwnProperty('createInProgress') ? this.tableConfig.createInProgress : null
      }
    },
    components: {
      SdsDotToolsBar,
      SdsScreenColumn,
      SdsTableFilter,
      SdsCellTools,
      extend
    },
    data () {
      return {
        columnOptions: columnOptions,
        currentColumnOptions: [],
        dropItem: [],
        fixedColumn: [],
        checkedColumns: [],
        originColumns: [],
        operateColumns: [],
        defaultColumnConfig: {
          width: "",
          showOverflowTooltip: true,
          resizable: true,
          align: "left"
        },
        dotToolShow: false,
        viewBy: 'overview'
      };
    },
    created () {
      let columnOptions = this.columnOptions[this.tableConfig.dir][
        this.tableConfig.columnOptions
      ];
      this.handleColumn(columnOptions)
      this.formatColumnOptions(this.currentColumnOptions);
    },
    watch: {
      viewBy (val) {
        if (val) {
          this.handleColumn(this.columnOptions[this.tableConfig.dir][
            this.tableConfig.columnOptions])
          this.formatColumnOptions(this.columnOptions[this.tableConfig.dir][
            this.tableConfig.columnOptions]);
        }
      }
    },
    methods: {
      handleColumn (columnOptions) {
        this.currentColumnOptions = columnOptions.map(column => {
          if (column.hasOwnProperty('viewBy')) {
            column.show = column.viewBy === this.viewBy
          }
          return column
        })
        if (!this.$refs || !this.$refs['sds-screen-column']) return
        this.currentColumnOptions = this.currentColumnOptions.filter(column => {
          return this.$refs['sds-screen-column'].checkedColumns.includes(column.prop) || this.fixedColumn.includes(column.prop)
        })
      },

      // 作用域插槽数据
      isExpand (scope, column) {
        if (column.type === "expand") {
          return {
            row: scope.row,
            columnOptions: this.columnOptions[this.tableConfig.dir][
              this.tableConfig.columnOptions
            ]
          };
        } else {
          return { row: scope.row, column: scope.column, columnOption: column };
        }
      },
      // 默认列配置
      defaultColumns () {
        let defaultColumns = [];
        let index = { label: "#", align: "center", type: "index", width: "50" };
        if (this.AccumulateIndex) index.index = this.indexMethod;
        let selection = { align: "center", type: "selection", width: "55" };
        let emptyColumn = { width: "16" };
        this.showIndex && defaultColumns.push(index);
        this.showSelect
          ? defaultColumns.push(selection)
          : defaultColumns.push(emptyColumn);
        return defaultColumns;
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
        return `${
          row[this.keysForStatus] && row[this.keysForStatus].indexOf("ing") !== -1 ? "sds-row-mask" : ""
        } sds-row-${row[this.keysForStatus]}--${this.$i18n.locale}`;
      },
      // 显示点操作栏
      showDotTools (e, item) {
        let target = e.target || e.srcElement || window.event.target;
        if (e.target.className.indexOf("sds-table-column__body") !== -1) {
          target.classList.add("sds-table-cell--active");
        }
      },
      // 隐藏点操作栏
      hideDotTools (e, item) {
        if (this.dotToolShow) {
          this.hideEventData = { e, item };
          return;
        }
        let target = e.target || e.srcElement || window.event.target;
        if (e.target.className.indexOf("sds-table-column__body") !== -1) {
          target.classList.remove("sds-table-cell--active");
        }
      },
      updateDotToolShow (bool) {
        this.dotToolShow = bool;
        if (!bool) {
          let { e, item } = this.hideEventData;
          this.hideDotTools(e, item);
        }
      },
      // 格式化可见列数据
      formatColumnOptions (columns) {
        let { dropItem, fixedColumn, checkedColumns, operateColumns } = {
          dropItem: [],
          fixedColumn: [],
          checkedColumns: [],
          operateColumns: []
        };
        for (let i = 0, len = columns.length; i < len; i++) {
          const column = columns[i];
          if (!column.locked && column.label) {
            if (!column.hasOwnProperty('show') || (column.hasOwnProperty('show') && column.show)) {
              dropItem.push({ value: column.prop, label: column.label });
            }
            if (!column.hidden) {
              checkedColumns.push(column.prop);
            }
          } else {
            if (column.prop) {
              fixedColumn.push(column.prop);
            } else {
              operateColumns.push(column.type);
            }
          }
        }
        this.dropItem = dropItem;
        this.fixedColumn = fixedColumn;
        this.checkedColumns = checkedColumns;
        this.operateColumns = operateColumns;
      },
      hideColumn (data) {
        this.checkedColumns = data.checkedColumns;
        this.originColumns = [...this.checkedColumns];
        this.currentColumnOptions = this.columnOptions[this.tableConfig.dir][this.tableConfig.columnOptions].filter(
          v => this.fixedColumn.includes(v.prop) || this.checkedColumns.includes(v.prop)
        );
      }
    }
  };
</script>
