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
        :key="serie.name">
        <el-switch v-model="switchMap[serie.name].switchVal"
          :active-color="getSerieColor(serie)"
          :active-text="serie.name">
        </el-switch>
        <span class="sds-line-legend-item-switch-lastest-value"
          :class="[{'is-disabled': !switchMap[serie.name].switchVal}]">
          {{serie.data[serie.data.length - 1]}}
        </span>
      </span>
    </div>
  </div>
</template>

<script>
  import { isUnDefined } from "../utils/utils";
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
    props: {
      options: {
        type: Object,
        default () {
          return {};
        }
      },
      showTitle: {
        type: Boolean,
        default: true
      },
      showSubtitle: {
        type: Boolean,
        default: true
      }
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
    },
    mounted () {
      this.initTtemStyles();
    },
    computed: {
      grids () {
        let grid = this.options.grid;
        return transformArray(grid);
      },
      titles () {
        let title = this.options.title;
        return transformArray(title);
      },
      xAxis () {
        let xAxis = this.options.xAxis;
        return transformArray(xAxis);
      },
      yAxis () {
        let yAxis = this.options.yAxis;
        return transformArray(yAxis);
      },
      filterSeries () {
        const series = this.options.series || [];
        return series.filter(serie => {
          return serie.name;
        });
      }
    },
    methods: {
      initTtemStyles () {
        const height = this.$el.offsetHeight || this.$parent.$el.offsetHeight;
        const gridLen = this.grids.length;
        let verticalStyle;
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
          if (this.switchMap.hasOwnProperty(serie.name)) {
            continue;
          }
          this.$set(this.switchMap, serie.name, { switchVal: true });
          this.$watch(
            () => {
              return this.switchMap[serie.name].switchVal;
            },
            (val) => {
              this.$emit("switch-change", serie.name, val);
            }
          );
        }
        return gridSeries;
      },
      getGridXAxis (index) {
        let xAxis = this.xAxis;
        return xAxis.filter(item => {
          return item.gridIndex === index || (index === 0 && !item.hasOwnProperty("gridIndex"));
        })[0];
      },
      getGridXAxisLastestData (index) {
        let gridXAxis = this.getGridXAxis(index);
        if (!gridXAxis) {
          return;
        }
        const data = gridXAxis.data || [];
        return data[data.length - 1];
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
        let diff = 8;
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
