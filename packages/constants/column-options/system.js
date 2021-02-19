/* type: index / expand /Selection 类型,
label: 列名,
prop: 列字段,
width: 列宽,
align: 列水平位置,
sortable: 是否排序,
sortMethod: 排序方法,
slotBodyName: 插槽体名称 ----插槽渲染,
slotHeaderName: 插槽头名称 ----插槽渲染,
formatter: 数据格式化,
filter: 是否筛选, true/false
fixed: 固定列到左或右  /true /'left'/'right'
resizable: 是否可调节列宽度
headerAlign: 表头对齐方式
locked: 固定列
renderBody: 自定义body,  ------render渲染
renderHead: 自定义header ------render渲染
showDotToolsBar: hover是否有工具栏
filterOptions: 筛选选项
*/

import { sort } from '../../utils/utils'
import i18n from "../../locale";

const WRITER_INFO = [
  {
    type: 'expand',
    width: 48,
    slotBodyName: 'expand',
  },
  {
    prop: 'title',
    label: 'Title',
    showDotToolsBar: true,
    locked: true,
    width: 500,
    filter: true,
    filters: [
      { value: 'published', text: '已出版' },
      { value: 'draft', text: '草稿' },
      { value: 'deleted', text: '已删除' },
      { value: 'solded', text: '已售空' },
      { value: 'designing', text: '设计中' },
      { value: 'baned', text: '已禁止' },
      { value: 'waited', text: '已排队' },
    ],
  },
  {
    prop: 'author',
    label: 'Author',
    showDotToolsBar: true,
    width: 200,
  },
  {
    prop: 'pageviews',
    label: 'Pageviews',
    width: 200,
    sortable: true,
    sortMethod: (obj1, obj2) => {
      return sort(obj1, obj2, 'pageviews')
    }
  },
  {
    prop: 'status',
    label: 'Status',
    showDotToolsBar: true,
    width: 120,
    slotBodyName: 'status',
    filter: true,
    filters: [
      { value: 'published', text: '已出版' },
      { value: 'draft', text: '草稿' },
      { value: 'deleted', text: '已删除' },
      { value: 'solded', text: '已售空' },
      { value: 'designing', text: '设计中' },
      { value: 'baned', text: '已禁止' },
      { value: 'waited', text: '已排队' },
    ],
  },
  {
    prop: 'display_time',
    label: 'Display_time',
    width: 200,
    slotBodyName: 'display_time',
    formatter (row, col) {
      return row[col] + 1
    },
    // renderBody (h, scope, tableVm, compVm) {
    //   return [
    //     h('i', { class: 'el-icon-time' }),
    //     h('span', {
    //       domProps: {
    //         innerHTML: tableVm.renderCell(scope.row, scope.column, scope.columnOption)
    //       }
    //     }),
    //     // <span>{tableVm.renderCell(scope.row, scope.column, scope.columnOption)}</span>
    //   ]
    // },
  },
  {
    align: 'right',
    type: 'operate',
    width: 200,
    slotBodyName: 'optionBody',
    slotHeaderName: 'optionHeader',
  },
]
const TREE_DATA = [
  {
    prop: 'date',
    label: '日期',
  },
  {
    prop: 'name',
    label: '姓名',
  },
  {
    prop: 'address',
    label: '地址',
  },
]
const TASKMANAGE = [
  {
    prop: 'name',
    label: '任务名称',
    viewBy: 'overview'
  },
  {
    prop: 'status',
    label: '状态',
    slotBodyName: 'status',
    align: 'center',
    viewBy: 'overview'
  },
  {
    prop: 'obj_name',
    label: '操作对象',
    align: 'center',
    viewBy: 'performance'
  },
  {
    prop: 'created_at',
    label: '创建时间',
    align: 'center',
    viewBy: 'performance'
  },
]
const NODE_LIST_OVERVIEW = [
  {
    prop: 'name',
    label: i18n.t('node').name,
    fixed: true,
    width: 100,
    hasDotToolsBar: true,
    slotBodyName: 'detail',
  },
  {
    prop: 'status',
    label: i18n.t('components').status,
    slotBodyName: 'status',
    align: "left",
    width: 100,
    fixed: true
  },
  {
    prop: 'ip',
    label: i18n.t('node').manage_ip,
    width: 120,
    viewBy: "overview"
  },
  {
    prop: 'tags',
    label: i18n.t('node').role,
    slotBodyName: 'tags',
    width: 300,
    viewBy: "overview"
  },
  {
    prop: 'cpu_capacity',
    label: i18n.t('node').cpu_rate,
    slotBodyName: 'capacity',
    width: 200,
    viewBy: "overview"
  },
  {
    prop: 'memory_capacity',
    label: i18n.t('node').memory_rate,
    slotBodyName: 'capacity',
    width: 200,
    viewBy: "overview"
  },
  {
    prop: 'disk_capacity',
    label: i18n.t('node').disk_rate,
    slotBodyName: 'capacity',
    width: 200,
    viewBy: "overview"
  },
  {
    prop: 'io_rate',
    label: i18n.t('node').io_rate,
    viewBy: "overview"
  },
  {
    prop: 'rack',
    label: i18n.t('node').rack,
    viewBy: "overview"
  },
  {
    prop: 'data_num',
    label: i18n.t('node').data_num,
    viewBy: "overview"
  },
  {
    prop: 'cache_num',
    label: i18n.t('node').cache_num,
    viewBy: "overview"
  },
  {
    prop: 'data_capacity',
    label: i18n.t('node').data_rate,
    slotBodyName: 'capacity',
    width: 200,
    viewBy: "overview"
  },
  {
    prop: 'vendor',
    label: i18n.t('node').vendor,
    viewBy: "overview"
  },
  {
    prop: 'type',
    label: i18n.t('node').type,
    viewBy: "overview"
  },
  {
    prop: 'packet_accept',
    label: i18n.t('node').packet_accept,
    viewBy: "performance"
  },
  {
    prop: 'packet_send',
    label: i18n.t('node').packet_send,
    viewBy: "performance"
  },
  {
    prop: 'bind_width_accept',
    label: i18n.t('node').bind_width_accept,
    viewBy: "performance"
  },
  {
    prop: 'bind_width_send',
    label: i18n.t('node').bind_width_send,
    viewBy: "performance"
  },
  {
    prop: 'packet_loss',
    label: i18n.t('node').packet_loss,
    viewBy: "performance"
  },
  {
    prop: 'packet_mistake',
    label: i18n.t('node').packet_mistake,
    viewBy: "performance"
  },
]
const NODE_DETAIL_CPU = [
  {
    prop: 'vendor',
    label: i18n.t('node').vendor,
    filter: true,
    filters: [],
  },
  {
    prop: 'type',
    label: i18n.t('node').type,
  },
  {
    prop: 'status',
    label: i18n.t('components').status,
    slotBodyName: 'status',
  },
  {
    prop: 'voltage',
    label: i18n.t('node').voltage,
    sortable: true,
    sortMethod: (obj1, obj2) => {
      return sort(obj1, obj2, 'voltage')
    }
  },
  {
    prop: 'temperature',
    label: i18n.t('node').cpu_temperature,
  },
]

const NODE_DETAIL_MEMORY = [
  {
    prop: 'vendor',
    label: i18n.t('node').vendor,
    filter: true,
    filters: [],
  },
  {
    prop: 'type',
    label: i18n.t('node').type,
  },
  {
    prop: 'status',
    label: i18n.t('components').status,
    slotBodyName: 'status',
  },
  {
    prop: 'capacity',
    label: i18n.t('node').memory_capacity,
    sortable: true,
    sortMethod: (obj1, obj2) => {
      return sort(obj1, obj2, 'capacity')
    }
  },
  {
    prop: 'SN',
    label: i18n.t('node').serial_number,
  },
]

const NODE_DETAIL_DISK = [
  {
    prop: 'name',
    label: i18n.t('node').disk_name,
  },
  {
    prop: 'status',
    label: i18n.t('components').status,
    slotBodyName: 'status',
  },
  {
    prop: 'tags',
    label: i18n.t('node').role,
    slotBodyName: 'tags',
  },
  {
    prop: 'type',
    label: i18n.t('components').type,
  },
  {
    prop: 'capacity',
    label: i18n.t('common').capacity,
    sortable: true,
    sortMethod: (obj1, obj2) => {
      return sort(obj1, obj2, 'capacity')
    }
  },
  {
    prop: 'light',
    label: i18n.t('node').disk_light,
    slotBodyName: 'light',
  },
]

const NODE_DETAIL_NETWORK = [
  {
    prop: 'name',
    label: i18n.t('node').device_name,
  },
  {
    prop: 'status',
    label: i18n.t('components').status,
    slotBodyName: 'status',
  },
  {
    prop: 'IP',
    label: 'IP'
  },
  {
    prop: 'application',
    label: i18n.t('node').application
  },
  {
    prop: 'rate',
    label: i18n.t('node').rate,
    sortable: true,
    sortMethod: (obj1, obj2) => {
      return sort(obj1, obj2, 'rate')
    }
  },
  {
    prop: 'MAC',
    label: i18n.t('node').mac,
  },
  {
    prop: 'MTU',
    label: i18n.t('node').mtu,
  },
  {
    type: 'operate',
    width: 200,
    slotBodyName: 'optionBody',
  },
]

export default {
  WRITER_INFO,
  TREE_DATA,
  TASKMANAGE,
  NODE_LIST_OVERVIEW,
  NODE_DETAIL_CPU,
  NODE_DETAIL_MEMORY,
  NODE_DETAIL_DISK,
  NODE_DETAIL_NETWORK
}
