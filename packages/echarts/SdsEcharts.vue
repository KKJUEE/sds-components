<script>
  import { addResizeListener, removeResizeListener } from "element-ui/lib/utils/resize-event";
  import { isEmpty } from "../utils/utils";
  import SdsLineLegend from "./SdsLineLegend";
  import emitter from "element-ui/lib/mixins/emitter";

  export default {
    name: 'sds-echarts',
    mixins: [emitter],
    props: {
      options: Object,
      height: String,
      showLegend: Boolean,
      span: {
        type: Number,
        default: 20
      },
      legendStyle: Object,
      legendClass: String,
      // left | right | top | bottom
      legendPosition: {
        type: String,
        default: "left"
      },
      legendProps: Object
    },
    provide () {
      return {
        legendPosition: this.legendPosition
      }
    },
    mounted () {
      this.initChart();
      addResizeListener(this.$refs.chart, this.handleResize);
    },
    beforeDestroy () {
      removeResizeListener(this.$refs.chart, this.handleResize);
      if (!this.chart) {
        return;
      }
      this.chart.dispose();
      this.chart = null;
    },
    data () {
      return {
        switchMap: {}
      }
    },
    computed: {
      isVertialLegend () {
        return this.legendPosition === "top" || this.legendPosition === "bottom";
      }
    },
    methods: {
      initChart () {
        this.chart = this.$echarts.init(this.$refs.chart);
        Object.keys(this.$listeners).forEach((event) => {
          let handler = this.$listeners[event];
          this.chart.on(event, handler);
        });
        this.drawChart();
      },
      drawChart () {
        let options = this.options;
        if (isEmpty(options)) {
          return;
        }
        if (this.showLegend) {
          options = { ...options };
          options.legend = options.legend || {};
          options.legend.show = false;
          options.legend.selected = this.switchMap;
        }
        this.chart.setOption(options, true);
      },
      handleResize () {
        this.chart && this.chart.resize();
        this.broadcast("sds-line-legend", "echarts-resize");
      },
      handleSwitchChange (serieName, switchVal) {
        this.switchMap[serieName] = switchVal;
        this.drawChart();
      },
      renderEcharts () {
        const h = this.$createElement;
        const options = {
          class: ["sds-echarts"],
          ref: "chart",
          style: {}
        };
        if (this.showLegend) {
          let span = this.span > 24 ? 24 : this.span;
          options.style.width = `${parseFloat(span / 24) * 100}%`;
        } else {
          options.style.height = this.height;
        }
        return h("div", options);
      },
      renderLegend () {
        const h = this.$createElement;
        return h(
          SdsLineLegend,
          {
            props: {
              showTitle: true,
              showSubtitle: true,
              options: this.options,
              ...this.legendProps
            },
            on: {
              "switch-change": this.handleSwitchChange
            },
            style: this.legendStyle,
            class: [this.legendClass]
          }
        );
      }
    },
    watch: {
      options (val) {
        this.drawChart();
      },
    },
    render (h) {
      if (!this.showLegend) {
        return this.renderEcharts();
      }
      return h(
        "div",
        {
          style: {
            height: this.height
          },
          class: [
            "sds-echarts-wrapper",
            "sds-legend-" + this.legendPosition
          ]
        },
        [
          this.renderLegend(),
          this.renderEcharts()
        ]
      );
    }
  }
</script>
