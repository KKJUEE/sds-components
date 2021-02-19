import {
  isObject,
  mergeOptions,
  transformCapacity,
  formatStr,
  formatUnitValue,
  isUnDefined
} from "./utils";
import { formatDate } from "element-ui/lib/utils/date-util";
import i18n from "@/locale";

const SERIES_TYPE = {
  LINE: "line",
  PIE: "pie",
  BAR: "bar"
};

const DEFAULT_TITLE_OPTIONS = {
  // 标题文本，支持使用 \n 换行
  text: "",
  // 标题文本样式
  textStyle: {
    color: "#333",
    fontSize: 20,
    fontWeight: 500,
  },
  // 副标题文本，支持使用 \n 换行
  subtext: "",
  // 副标题文本样式
  subtextStyle: {
    color: "#BBC0C5",
    fontSize: 12,
  },
  // 标题内边距，单位px，默认各方向内边距为5，接受数组分别设定上右下左边距
  padding: 5, // or [5, 10] or [5, 10, 5, 10]
  // 主副标题之间的间距
  itemGap: 10,
  // title 组件离容器左侧的距离
  // 可选值：'left', 'center', 'right'
  // 可以是像 20 这样的具体像素值，可以是像 '20%' 这样相对于容器高宽的百分比
  left: "center",
  // title 组件离容器右侧的距离
  // 可选值：'top', 'middle', 'bottom'
  // 可以是像 20 这样的具体像素值，可以是像 '20%' 这样相对于容器高宽的百分比
  top: "top",
};
const DEFAULT_LEGEND_OPTIONS = {
  // 可选值：plain、scroll（可滚动翻页的图例。当图例数量较多时可以使用）
  type: "plain",
  // 图例 组件离容器左侧的距离
  // 可选值：'left', 'center', 'right'
  // 可以是像 20 这样的具体像素值，可以是像 '20%' 这样相对于容器高宽的百分比
  left: "auto",
  // 图例 组件离容器上侧的距离
  // 可选值：'top', 'middle', 'bottom'
  // 可以是像 20 这样的具体像素值，可以是像 '20%' 这样相对于容器高宽的百分比
  top: "auto",
  // 图例 组件离容器右侧的距离
  right: "auto",
  // 图例 组件离容器上侧的距离
  bottom: "auto",
  // 图例组件的宽度，值类型：number,string
  width: "auto",
  // 图例组件的高度,值类型：number,string
  height: "auto",
  // 图例列表的布局朝向
  // 可选值：horizontal、vertical
  orient: "horizontal",
  // 图例内边距，单位px，默认各方向内边距为5，接受数组分别设定上右下左边距
  padding: 5, // or [5, 10] or [5, 10, 5, 10]
  // 图例每项之间的间隔。横向布局时为水平间隔，纵向布局时为纵向间隔
  itemGap: 10,
  // 图例标记的图形宽度
  itemWidth: 25,
  // 图例标记的图形高度
  itemHeight: 14,
  // 图例的公用文本样式
  textStyle: {
    color: "#333"
  },
  // 配置项同 series层级的tooltip。默认不显示，可以在 legend 文字很多的时候对文字做裁剪并且开启 tooltip
  tooltip: {
    show: false
  },
  // 图例项的 icon
  // 可选值：'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow', 'none'
  // 可为图片的URL链接
  // 不设时默认系列图形的icon
  // icon: "roundRect",
  data: [],
};
const DEFAULT_TOOLTIP_OPTIONS = {
  // 触发类型
  // 可选值：item/axis/none
  // item: 数据项图形触发，主要在散点图，饼图等无类目轴的图表中使用
  // axis: 坐标轴触发，主要在柱状图，折线图等会使用类目轴的图表中使用
  trigger: "item",
  // 是否将 tooltip 的 DOM 节点添加为 HTML 的 <body> 的子节点
  appendToBody: false,
  // 提示框浮层的位置，默认不设置时位置会跟随鼠标的位置
  // 绝对位置position: [10, 10]，相对于容器左侧 10px, 上侧 10 px
  // 相对位置position: ['50%', '50%']，放置在容器正中间
  position: null,
  // 提示框浮层内容格式器,值类型：string/Function
  // 模板变量有 {a}, {b}，{c}，{d}分别表示系列名，数据名，数据值，百分比
  // formatter: "{a} <br/>{b}: {c}",
  // 提示框浮层的文本样式
  textStyle: {
    color: "#fff",
    fontSize: 12
  },
  // 坐标轴指示器快捷方式配置
  axisPointer: {
    // 触发类型
    // 可选值： line/shadow/cross/none
    // line: 直线指示器
    // shadow: 阴影指示器
    // cross: 十字准星指示器。其实是种简写，表示启用两个正交的轴的 axisPointer
    type: "line",
    // 指示器的坐标轴
    // 可选值：'x', 'y', 'radius', 'angle'
    // 默认情况，坐标系会自动选择显示哪个轴的 axisPointer（默认取类目轴或者时间轴）
    axis: "auto",
    lineStyle: {
      color: '#0d91f3'
    }
  }
};
const DEFAULT_GRID_OPTIONS = {
  show: false,
  // grid 组件离容器左侧的距离
  // 可选值：'left', 'center', 'right'
  // 可以是 20 这样的具体像素值，也可以是 '20%' 这样相对于容器高宽的百分比
  left: "3%",
  // grid 组件离容器上侧的距离
  // 可选值：'top', 'middle', 'bottom'
  // 可以是 20 这样的具体像素值，也可以是 '20%' 这样相对于容器高度的百分比
  top: 5,
  // grid 组件离容器右侧的距离,其余同left
  right: "3%",
  // grid 组件离容器下侧的距离,其余同top
  bottom: 3,
  // grid 组件的宽度。默认自适应
  width: "auto",
  // grid 组件的高度。默认自适应
  height: "auto",
  // grid 区域是否包含坐标轴的刻度标签
  // false时：grid决定的是由坐标轴形成的矩形的尺寸和位置
  // true时：grid决定的是包括了坐标轴标签在内的所有内容所形成的矩形的位置，常用于『防止标签溢出』的场景
  containLabel: true,
};
const DEFAULT_XAXIS_OPTIONS = {
  // 是否显示 x 轴
  show: true,
  // x 轴的位置
  // 可选值： bottom,top
  position: "bottom",
  // 坐标轴类型
  // 可选值：value,category，time，log
  // value: 数值轴，适用于连续数据
  // category: 类目轴，适用于离散的类目数据
  // time: 时间轴，适用于连续的时序数据，与数值轴相比时间轴带有时间的格式化，在刻度计算上也有所不同
  // log:对数轴。适用于对数数据
  type: "category",
  // 坐标轴名称
  name: "",
  // 坐标轴名称显示位置
  // 可选值： start、middle、end
  nameLocation: "end",
  // 坐标轴名称与轴线之间的距离
  nameGap: 15,
  // 坐标轴名称文本样式设置
  nameTextStyle: {
    // 不设时默认取axisLine.lineStyle.color
    color: "#333",
    fontSize: 14,
    align: 'left'
  },
  // 坐标轴两边留白策略，类目轴和非类目轴的设置和表现不一样
  // 类目轴中 boundaryGap 可以配置为 true 和 false。默认为 true，这时候刻度只是作为分隔线，标签和数据点都会在两个刻度之间的带(band)中间
  // 非类目轴boundaryGap是一个两个值的数组，分别表示数据最小值和最大值的延伸范围，可以直接设置数值或者相对的百分比，在设置 min 和 max 后无效
  boundaryGap: false,
  // 坐标轴刻度最小值,值类型：number、string、Function
  // 可以设置成特殊值 'dataMin'，此时取数据在该轴上的最小值作为最小刻度,不设置时会自动计算最小值保证坐标轴刻度的均匀分布
  min: null,
  // 坐标轴刻度最大值,值类型：number、string、Function
  // 可以设置成特殊值 'dataMax'，此时取数据在该轴上的最大值作为最大刻度,不设置时会自动计算最大值保证坐标轴刻度的均匀分布
  max: null,
  // 坐标轴的分割段数
  // 需要注意的是这个分割段数只是个预估值，最后实际显示的段数会在这个基础上根据分割后坐标轴刻度显示的易读程度作调整
  // 类目轴中无效
  splitNumber: 4,
  // 自动计算的坐标轴最小间隔大小
  // 只在数值轴或时间轴中有效
  // 可以设置成1保证坐标轴分割段数显示成整数
  minInterval: 1,
  // 自动计算的坐标轴最大间隔大小
  // 只在数值轴或时间轴中有效
  maxInterval: null,
  // 坐标轴轴线相关设置
  axisLine: {
    // 是否显示坐标轴轴线
    show: true,
    // 坐标轴线样式设置
    lineStyle: {
      color: "#d9dada",
      // 坐标轴线线宽
      width: 1
    }
  },
  // 坐标轴刻度相关设置
  axisTick: {
    // 是否显示坐标轴刻度
    show: true,
    // 类目轴中在 boundaryGap 为 true 的时候有效，可以保证刻度线和标签对齐
    alignWithLabel: true,
    // 坐标轴刻度是否朝内
    inside: false,
    // 坐标轴刻度的长度
    length: 5,
    // 刻度线的样式设置
    lineStyle: {
      color: "#d9dada",
      // 刻度线线宽
      width: 1
    }
  },
  // 坐标轴刻度标签相关设置
  axisLabel: {
    // 是否显示刻度标签
    show: true,
    // 坐标轴刻度标签的显示间隔，在类目轴中有效,默认会采用标签不重叠的策略间隔显示标签
    // 设置成 0 强制显示所有标签
    // 其余数值：隔x个标签显示一个标签
    interval: "auto",
    color: "#99a8b1",
    fontSize: 10
  },
  // 坐标轴在 grid 区域中的分隔线设置
  splitLine: {
    // 是否显示分隔线。默认数值轴显示，类目轴不显示
    show: false,
    // 分隔线样式设置
    lineStyle: {
      // 分隔线会按数组中颜色的顺序依次循环设置颜色
      color: ['#ccc']
    }
  },
};

const DEFAULT_YAXIS_OPTIONS = {
  ...DEFAULT_XAXIS_OPTIONS,
  type: "value",
  position: "left",
  boundaryGap: [0, "30%"],
};

const DEFAULT_LINE_OPTIONS = {
  type: SERIES_TYPE.LINE,
  // 图形名称，用于tooltip的显示，legend的图例筛选
  name: "",
  // 是否平滑曲线显示
  smooth: false,
  // hover图例时的是否联动高亮
  legendHoverLink: true,
  // 折线标记的图形
  // 默认是emptyCircle，可选值：'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow', 'none'，
  // 也可以是图片的URL链接
  symbol: "emptyCircle",
  // 标记的大小
  // 值类型：number(4同[4,4]), Array([20,10],20表示标记的宽，10表示标记的高), Function
  symbolSize: 4,
  // 是否显示标记，false时只有tooltip和hover时显示
  showSymbol: false,
  // 是否开启 hover 在拐点标志上的提示动画效果。
  hoverAnimation: true,
  // 图形上的文本标签，用于说明图形的一些数据信息
  // 不显示文本标签可不设
  label: {
    show: false,
  },
  // 线条样式
  lineStyle: {
    // 线条颜色默认也会取itemStyle.color,不设itemStyle.color时会默认去调色盘 option.color 获取颜色
    // "color": "#000",
    // 线宽
    width: 2
  },
  // 图形高亮时的样式
  emphasis: {
    // 高亮时图形上的文本标签设置，同emphasis层级的label
    label: {
      show: false
    }
  },
};

const DEFAULT_PIE_OPTIONS = {
  type: SERIES_TYPE.PIE,
  // 图形名称，用于tooltip的显示，legend的图例筛选
  name: "",
  // hover图例时的是否联动高亮
  legendHoverLink: true,
  // 是否开启 hover 在扇区上的放大动画效果，默认值为true
  hoverAnimation: false,
  // 高亮扇区偏移距离，hover动画开启时有效
  hoverOffset: 10,
  // 最小的扇区角度（0 ~ 360），用于防止某个值过小导致扇区太小影响交互
  // 取值范围：0 ~ 360
  minAngle: 0,
  // 是否启用防止标签重叠策略，默认开启，在标签拥挤重叠的情况下会挪动各个标签的位置，防止标签间的重叠
  // 如果只是扇区高亮时显示标签，可将该值设为false
  avoidLabelOverlap: true,
  // 是否在数据和为0的时候不显示扇区
  stillShowZeroSum: true,
  // pie chart组件离容器左侧的距离
  // 值类型：number,string
  // string时的可选值：'left', 'center', 'right'，表示相对容器的对其方式
  left: "auto",
  // pie chart组件离容器上侧的距离,其余同left
  top: "auto",
  // pie chart组件的宽度。默认自适应
  // 值类型string，number
  width: "auto",
  // pie chart组件的高度。默认自适应
  // 值类型string，number
  height: "auto",
  // 图形上的文本标签设置，用于说明图形的一些数据信息
  // 不显示文本标签可不设
  label: {
    show: false,
    // 标签的位置
    // 可选值：outside（扇区外侧），inside（扇区内部），center（饼图中心位置）
    position: "center",
    // 标签文字的颜色，不设置时颜色同扇区颜色
    // color: "#000"
  },
  // 图形高亮时的样式
  emphasis: {
    // 高亮时图形上的文本标签设置，同emphasis层级的label
    label: {
      show: false,
    }
  },
  // 饼图的中心（圆心）坐标，数组的第一项是横坐标，第二项是纵坐标
  center: ["50%", "50%"],
  // 饼图的半径,数组的第一项是内半径，第二项是外半径
  radius: ["75%", "95%"],
  // 系列中的数据内容数组
  data: []
};

const DEFAULT_BAR_OPTIONS = {
  type: SERIES_TYPE.BAR,
  // 图形名称，用于tooltip的显示，legend的图例筛选
  name: "",
  // hover图例时的是否联动高亮
  legendHoverLink: true,
  // 图形上的文本标签设置，用于说明图形的一些数据信息
  // 不显示文本标签可不设
  label: {
    show: false,
    // 标签的位置
    // 可选值：top / left / right / bottom / inside / insideLeft / insideRight / insideTop
    // insideBottom / insideTopLeft / insideBottomLeft / insideTopRight / insideBottomRight
    // 也可以用一个数组表示相对的百分比或者绝对像素值表示标签相对于图形包围盒左上角的位置
    position: "top"
  },
  // 图形高亮时的样式
  emphasis: {
    // 高亮时图形上的文本标签设置，同emphasis层级的label
    label: {
      show: false,
    },
  },
  // 柱条的宽度，不设时自适应
  // 可以是绝对值例如 40 或者百分数例如 '60%'。百分数基于自动计算出的每一类目的宽度
  barWidth: null,
  // 柱条最小高度，可用于防止某数据项的值过小而影响交互
  barMinHeight: 5,
  // 不同系列的柱间距离，为百分比（如 '30%'，表示柱子宽度的 30%）
  barGap: "30%",
  // 同一系列的柱间距离，默认为类目间距的20%，可设固定值
  barCategoryGap: "20%",
  // 系列中的数据内容数组
  data: [],
};

const DEFAULT_COLORS = {
  LINE: ['#0D91F3'],
  DOUBLE_LINE: ['#FFC307', '#0D91F3'],
  TRIPLE_LINE: ['#FFC307', '#0D91F3', "#954CFF"],
  PIE: ['#0D91F3', '#F0F2F5'],
};

// 获取线性渐变的颜色
function getLinearGradientColor (startColor, endColor) {
  return {
    type: "linear",
    x: 0,
    y: 0,
    x2: 0,
    y2: 1,
    colorStops: [
      {
        offset: 1,
        color: startColor // 0% 处的颜色
      },
      {
        offset: 0,
        color: endColor // 100% 处的颜色
      }
    ]
  }
}

function getTitleOptions (text = "", subtext = "", options = {}) {
  if (isObject(text)) {
    options = text;
  } else {
    if (isObject(subtext)) {
      options = subtext;
    } else {
      options.subtext = subtext;
    }
    options.text = text;
  }
  return mergeOptions({}, DEFAULT_TITLE_OPTIONS, options);
}

function getLegendOptions (data, options = {}) {
  if (isObject(data)) {
    options = data;
  } else {
    options.data = data;
  }
  return mergeOptions({}, DEFAULT_LEGEND_OPTIONS, options);
}

function getTooltipOptions (trigger, options = {}) {
  if (isObject(trigger)) {
    options = trigger;
  } else {
    options.trigger = trigger;
  }
  return mergeOptions({}, DEFAULT_TOOLTIP_OPTIONS, options);
}

function getGridOptions (options = {}) {
  return mergeOptions({}, DEFAULT_GRID_OPTIONS, options);
}

function getXAxisOptions (type = "category", options = {}) {
  if (isObject(type)) {
    options = type;
  } else {
    options.type = type;
  }
  return mergeOptions({}, DEFAULT_XAXIS_OPTIONS, options);
}

function getYAxisOptions (type = "value", options = {}) {
  if (isObject(type)) {
    options = type;
  } else {
    options.type = type;
  }
  return mergeOptions({}, DEFAULT_YAXIS_OPTIONS, options);
}

function getSeriesOptions (type, name, data, options = {}) {
  if (isObject(name)) {
    options = name;
  } else {
    if (isObject(data)) {
      options = data;
    } else {
      options.data = data;
    }
    options.name = name;
  }
  switch (type) {
  case SERIES_TYPE.LINE :
    return mergeOptions({}, DEFAULT_LINE_OPTIONS, options);
  case SERIES_TYPE.PIE :
    return mergeOptions({}, DEFAULT_PIE_OPTIONS, options);
  case SERIES_TYPE.BAR :
    return mergeOptions({}, DEFAULT_BAR_OPTIONS, options);
  default:
    return options;
  }
}

function getSeriesLineOptions (name, data, options = {}) {
  return getSeriesOptions(SERIES_TYPE.LINE, name, data, options);
}

function getSeriesPieOptions (name, data, options = {}) {
  return getSeriesOptions(SERIES_TYPE.PIE, name, data, options);
}

function getSeriesBarOptions (name, data, options = {}) {
  return getSeriesOptions(SERIES_TYPE.BAR, name, data, options);
}

function getLineCapcityTooltip () {
  return getTooltipOptions("axis", {
    formatter (params) {
      const param = params[0];
      const value = param.value;
      const seriesName = param.seriesName;
      const time = formatDate(new Date(value[0] * 1000)) + "<br>";
      const cap = transformCapacity(value[1]);
      const color = param.color;
      return `<span>${time}<span class="after-colon">
        <span class="sds-series-dot" style="background-color:${color}"></span>
        ${seriesName}</span><span>${cap}</span></span>`;
    }
  });
}
/**
 * series name 与 legend name是一一对应关系，对于legend来说系列名称是唯一标识
 * 所以，对于不同系列但名称相同的系列，需要建立别名映射关系
 * {'系列名': {alias: '别名', formatter: "string/function"}} or {'系列名': '别名'}
 * @params {object} seriesNameMap
 * */
function getLineTooltip (seriesNameMap) {
  seriesNameMap = isObject(seriesNameMap) ? seriesNameMap : {};
  return getTooltipOptions("axis", {
    formatter (params) {
      let result = {};
      let time;
      params.forEach(param => {
        let formatter;
        let title = "";
        const seriesName = param.seriesName;
        let alias = seriesName;
        const data = param.data;
        const seriesIndex = param.seriesIndex;
        const color = param.color;
        let value = data[seriesIndex + 1];
        const axisValue = param.axisValue;
        const seriesNameMapVal = seriesNameMap[seriesName];
        // grid index
        const axisIndex = param.axisIndex;
        if (typeof seriesNameMapVal === "string") {
          alias = seriesNameMapVal;
        } else if (isObject(seriesNameMapVal)) {
          alias = seriesNameMapVal.alias;
          formatter = seriesNameMapVal.formatter;
          title = seriesNameMapVal.title;
        }
        value = formatUnitValue(value, formatter);
        time = time || formatDate(new Date(axisValue * 1000), "yyyy-MM-dd HH:mm");
        title && (title = `<span>${title}</span><br>`);
        result[axisIndex] = result[axisIndex] || title;
        result[axisIndex] = result[axisIndex] + `<span class="after-colon">
          <span class="sds-series-dot" style="background-color:${color}"></span>
          ${alias}</span><span>${value}</span><br>`;
      });
      let temp = "";
      Object.keys(result).forEach((key) => {
        temp = temp + result[key] + "<br>";
      });
      return `<span>${time}</span><br>` + temp;
    }
  });
}

function generateLegendTitles (...titleTexts) {
  return titleTexts.map(text => {
    return {
      show: false,
      text: text
    }
  });
}
/**
 * @param {string|number} firstTop - 第一个grid具体容器顶部的距离的百分比
 * @param {string|number} left
 * @param {string|number} right
 * @param {string|number} verticalSpace -  grid间垂直方向上空隙百分比
 * */
function generateGrids (firstTop, left, right, verticalSpace, ...heights) {
  const len = heights.length;
  verticalSpace = parseFloat(verticalSpace || 10);
  firstTop = isUnDefined(firstTop) ? (1 / (16 * len)).toFixed(2) * 100 : firstTop;
  firstTop = parseFloat(firstTop);
  left = isUnDefined(left) ? "8%" : left;
  right = isUnDefined(right) ? 0 : right;
  return heights.map((height, index) => {
    height = parseFloat(height);
    let top = index * (height + verticalSpace) + firstTop;
    return {
      top: top + "%",
      left: left,
      right: right,
      height: height + "%",
      containLabel: false
    }
  });
}

function generateXAxis (formatter, ...options) {
  return options.map((option, index) => {
    option = option || {};
    return getXAxisOptions({
      gridIndex: index,
      axisLabel: {
        formatter: formatter,
      },
      maxInterval: 24 * 60 * 60,
      ...option
    })
  });
}

function generateXAxisTimeFormatter (data = []) {
  const startTime = data[0][0] * 1000;
  const endTime = data[data.length - 1][0] * 1000;
  let format = "HH:mm";
  if (endTime - startTime > 24 * 60 * 60 * 1000) {
    format = "MM-dd HH:mm";
  }
  return function formatter (value, index, innerFormat) {
    return formatDate(new Date(value * 1000), innerFormat || format);
  }
}

function generateYAxis (formatters, ...options) {
  formatters = formatters || [];
  return options.map((option, index) => {
    option = option || {};
    return getYAxisOptions({
      gridIndex: index,
      axisTick: {
        show: false
      },
      axisLine: {
        show: false
      },
      axisLabel: {
        formatter: formatters[index] || "{value}",
        margin: 10
      },
      splitLine: {
        show: true,
        lineStyle: {
          type: "dashed"
        }
      },
      ...option
    });
  });
}

function generateAnalysisTimeOptions () {
  return [
    { label: i18n.t("common.real_time"), value: 0 },
    { label: formatStr(i18n.t("common.hour_within"), 3), value: "-3h" },
    { label: formatStr(i18n.t("common.day_within"), 1), value: "-1d" },
    { label: formatStr(i18n.t("common.week_within"), 1), value: "-1w" },
    { label: formatStr(i18n.t("common.month_within"), 1), value: "-1m" },
    { label: formatStr(i18n.t("common.month_within"), 3), value: "-3m" },
    { label: i18n.t("common.custom_time"), value: 1 }
  ]
}

export {
  getTitleOptions,
  getLegendOptions,
  getTooltipOptions,
  getGridOptions,
  getXAxisOptions,
  getYAxisOptions,
  getLinearGradientColor,
  getSeriesOptions,
  getSeriesLineOptions,
  getSeriesPieOptions,
  getSeriesBarOptions,
  DEFAULT_COLORS,
  getLineCapcityTooltip,
  generateLegendTitles,
  generateGrids,
  generateXAxis,
  generateYAxis,
  generateXAxisTimeFormatter,
  getLineTooltip,
  generateAnalysisTimeOptions
}
