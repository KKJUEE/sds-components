##Sds基础组件库

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

## 基础组件
```
baseSet 基本布局
breadcrumbBar   面包屑
clipboard 剪切板
collapse    折叠面板
detailCollapse  详情手风琴
detailLayout 详情布局
dropdownBtn 下拉按钮
echarts echarts
empty 空白页
icon 图标
input 输入组件
modal 窗口
result 结果页
scrollbar  滚动条
pagination  分页组件
topActionBar    表格顶部操作按钮
select 选择框+tree的组合
steps   步骤
table   表格
tag 标签
tree    树形结构，包含checkBox和radio
```

## 依赖文件
```
utils 公共方法
locale  国际化内容
constants 包含表格title
mixins 包含表格方法
directives 指令
```

### 组件使用方式
```
import 'sds-components/lib/style/index.css'
import SdsComponents from 'sds-components'
...
Vue.use(SdsComponents)
```


注意：

1、暂时无法通过组件按需引入，需要全局引入

2、样式文件单独引入

3、引用项目需实现i18n的$t函数

### 更新记录
2020-11-4

1、table组件与pagination组件拆分

2、增加表格操作的指令

3、修复table的数据源data问题

4、规范化table组件对外暴露事件的函数名

