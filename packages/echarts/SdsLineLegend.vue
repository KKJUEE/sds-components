<template>
  <div class="sds-line-legend">
    <div class="sds-line-legend-item" v-for="(grid, index) in grids" :key="index"
      :style="itemStyles[index]">
      <span class="sds-line-legend-item-title" v-if="titles.length > 0 && showTitle">
        {{titles[index].text}}
      </span>
      <span class="sds-line-legend-item-sub-title" v-if="xAxis.length > 0 && showSubtitle">
        {{getGridXAxisLastestData(index)}}
      </span>
      <span v-for="serie in getGridSeries(index)" class="sds-line-legend-item-switch"
        :key="serie.alias || serie.name">
        <el-switch v-model="switchMap[serie.name].switchVal"
          :active-color="getSerieColor(serie)"
          :active-text="serie.alias || serie.name">
        </el-switch>
        <span class="sds-line-legend-item-switch-lastest-value"
          :class="[{'is-disabled': !switchMap[serie.name].switchVal}]">
          {{getGridYAxisLastestData(serie, index)}}
        </span>
      </span>
    </div>
  </div>
</template>

<script>
  import { isUnDefined, formatUnitValue } from "../utils/utils";
  function transformArray (src) {
    if (Array.isArray(src)) {
      return src;
    }
    return src ? [].concat(src) : [];
  }
  function transformGirdPropVal (val, containerHeight) {
    let temp;
    if (/%$/.test(val)) {
      temp = containerHeight * (parseInt(val) / 100);
    } else {
      temp = Number(val);
    }
    return temp;
  }
  export default {
    name: "sds-line-legend",
    componentName: "sds-line-legend",
    props: {
      options: Object,
      showTitle: {
        type: Boolean,
        default: true
      },
      showSubtitle: {
        type: Boolean,
        default: true
      },
      offset: Number
    },
    inject: {
      position: {
        from: "legendPosition",
        default: null
      }
    },
    data () {
      return {
        switchMap: {},
        itemStyles: [],
      }
    },
    created () {
      this.colorLoopCount = 0;
      this.$on("echarts-resize", this.initTtemStyles);
    },
    mounted () {
      this.initTtemStyles();
    },
    computed: {
      grids () {
        const options = this.options || {};
        let grid = options.grid;
        return transformArray(grid);
      },
      titles () {
        const options = this.options || {};
        let title = options.title;
        return transformArray(title);
      },
      xAxis () {
        const options = this.options || {};
        let xAxis = options.xAxis;
        return transformArray(xAxis);
      },
      yAxis () {
        const options = this.options || {};
        let yAxis = options.yAxis;
        return transformArray(yAxis);
      },
      filterSeries () {
        const options = this.options || {};
        const series = options.series || [];
        return series.filter(serie => {
          return serie.name;
        });
      }
    },
    methods: {
      initTtemStyles () {
        const chartElm = this.$parent.$refs.chart;
        let height = this.$el.offsetHeight || (chartElm.offsetHeight);
        const gridLen = this.grids.length;
        let verticalStyle;
        this.itemStyles = [];
        for (let i = 0; i < gridLen; i++) {
          let grid = this.grids[i];
          verticalStyle = this.getVerticalStyle(grid, height);
          this.itemStyles.push(verticalStyle);
        }
      },
      getGridSeries (index) {
        const series = this.filterSeries;
        const gridSeries = series.filter(serie => {
          return (serie.xAxisIndex === index && serie.yAxisIndex === index) ||
            (index === 0 && !serie.hasOwnProperty("xAxisIndex") && !serie.hasOwnProperty("yAxisIndex"));
        });
        for (let i = 0; i < gridSeries.length; i++) {
          let serie = gridSeries[i];
          let mark = serie.name;
          if (this.switchMap.hasOwnProperty(mark)) {
            continue;
          }
          this.$set(this.switchMap, mark, { switchVal: true });
          this.$watch(
            () => {
              return this.switchMap[mark].switchVal;
            },
            (val) => {
              this.$emit("switch-change", serie.name, val);
            }
          );
        }
        return gridSeries;
      },
      getGridAxis (direction, index) {
        let axis = direction === "y" ? this.yAxis : this.xAxis;
        return axis.filter(item => {
          return item.gridIndex === index || (index === 0 && !item.hasOwnProperty("gridIndex"));
        })[0];
      },
      getGridXAxisLastestData (index) {
        let gridXAxis = this.getGridAxis("x", index);
        if (!gridXAxis) {
          return;
        }
        const dataset = this.options.dataset;
        const source = dataset ? dataset.source : [];
        const data = gridXAxis.data || [];
        const axisLabel = gridXAxis.axisLabel || {};
        const formatter = axisLabel.formatter;
        const format = axisLabel.lastest_format;
        let lastestValue = data[data.length - 1] || source[source.length - 1][0];
        // [[x,y],[x1,y1]]
        Array.isArray(lastestValue) && (lastestValue = lastestValue[0]);
        if (typeof formatter === "function") {
          lastestValue = formatter(lastestValue, source.length, format || "yyyy-MM-dd HH:mm");
        }
        return lastestValue;
      },
      getGridYAxisLastestData (serie, gridIndex) {
        let gridYAxis = this.getGridAxis("y", gridIndex);
        if (!gridYAxis) {
          return;
        }
        const serieIndex = this.options.series.indexOf(serie);
        const dataset = this.options.dataset;
        const source = dataset ? dataset.source : [];
        const data = serie.data || [];
        const axisLabel = gridYAxis.axisLabel || {};
        const formatter = axisLabel.formatter;
        let lastestValue = data[data.length - 1] || source[source.length - 1][serieIndex + 1];
        // [[x,y],[x1,y1]]
        Array.isArray(lastestValue) && (lastestValue = lastestValue[1]);
        return formatUnitValue(lastestValue, formatter);
      },
      getSerieColor (serie) {
        let color;
        if (serie.itemStyle && (color = serie.itemStyle.color)) {
          return color;
        }
        let temp = this.colorLoopCount;
        color = this.options.color[temp];
        ++temp;
        if (temp > this.options.color.length - 1) {
          temp = 0;
        }
        this.colorLoopCount = temp;
        this.$nextTick(() => {
          this.colorLoopCount = 0;
        });
        return color;
      },
      getVerticalStyle (grid, containerHeight) {
        let top, bottom, height;
        const gridLen = this.grids.length;
        let girdTop = grid.top;
        let girdBottom = grid.bottom;
        let girdHeight = grid.height;
        !isUnDefined(girdTop) && (top = transformGirdPropVal(girdTop, containerHeight));
        !isUnDefined(girdBottom) && (bottom = transformGirdPropVal(girdBottom, containerHeight));
        height = transformGirdPropVal(girdHeight, containerHeight);
        height = height || ((1 / gridLen) * 100) * containerHeight;
        if (gridLen === 1) {
          isUnDefined(girdTop) && (top = 60);
        }
        let isTop = this.position === "top";
        let isBottom = this.position === "bottom";
        // 26为legend-item水平排布时的高度
        const lengendItemHeight = 26;
        let diff = grid.containLabel || !(isTop || isBottom) ? 12 : 24;
        diff = this.offset || diff;
        if (isTop) {
          diff = lengendItemHeight + 8;
        } else if (isBottom) {
          diff = -(height + lengendItemHeight + diff);
          bottom && (bottom = bottom - containerHeight - lengendItemHeight * 2);
        }
        top && (top = `${top - diff}px`);
        bottom && (bottom = `${bottom}px`);
        return {
          top,
          bottom
        }
      }
    }
  }
</script>
