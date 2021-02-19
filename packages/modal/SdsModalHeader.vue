<script>
  import SdsIcon from "../icon";
  import { formatStr } from "../utils/utils";

  export default {
    name: "sds-modal-header",
    props: {
      title: String,
      showCloseBtn: {
        type: Boolean,
        default: true,
      },
      infoIcon: String,
    },
    inject: ["rootModal"],
    computed: {
      isNeedFormat () {
        return this.rootModal.formatTitle && /\{(\d+)\}/g.test(this.title);
      },
      formatTitle () {
        let title = this.title;
        let formatTitle = this.rootModal.formatTitle;
        if (this.isNeedFormat) {
          !Array.isArray(formatTitle) && (formatTitle = [formatTitle]);
          formatTitle = formatTitle.map(msg => {
            return `<span class='sds-modal-info-title-format'>${msg}</span>`;
          });
          title = formatStr(title, ...formatTitle);
        }
        return title;
      }
    },
    methods: {
      renderInfoTitle (titleVNode) {
        let h = this.$createElement;
        if (!this.rootModal.isInfo) {
          return null;
        }
        let data = {
          class: [
            "sds-modal-info-title"
          ],
        };
        !titleVNode && (data.domProps = { innerHTML: this.formatTitle });
        return h(
          "div",
          {
            class: [
              "sds-modal-info-title-wrapper"
            ]
          },
          [
            h(
              SdsIcon,
              {
                props: {
                  icon: this.infoIcon
                }
              }
            ),
            h(
              "span",
              data,
              [titleVNode]
            )
          ]
        )
      },
      renderTitle () {
        let h = this.$createElement;
        let titleVNode = this.$scopedSlots.title();
        if (!this.title && !titleVNode) {
          return null;
        }
        if (this.rootModal.isInfo) {
          return this.renderInfoTitle(titleVNode);
        }
        return h(
          "div",
          {
            class: [
              "sds-modal-title",
            ]
          },
          [titleVNode || this.title]
        )
      },
      renderCloseBtn  () {
        let h = this.$createElement;
        if (!this.showCloseBtn) {
          return null;
        }
        return h(
          "button",
          {
            class: [
              "sds-modal-close-btn"
            ],
            on: {
              click: (e) => {
                this.$emit('close-click', e);
              }
            }
          },
          [
            h(
              "i",
              {
                class: [
                  "iconfont icon-sds-close",
                ]
              }
            )
          ]
        )
      }
    },
    render (h) {
      return h(
        "div",
        {
          class: [
            "sds-modal-header"
          ]
        },
        this.$slots.default || [
          this.renderTitle(),
          this.renderCloseBtn(),
        ]
      )
    }
  }
</script>
