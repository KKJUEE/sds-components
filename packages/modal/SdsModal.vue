<script>
  import SdsModalHeader from "./SdsModalHeader";
  import SdsModalBody from "./SdsModalBody";
  import SdsModalFooter from "./SdsModalFooter";
  import { debounce, pauseEvent } from "../utils/utils";

  let zIndex = 1000;
  const showedZIndexs = [];

  function getMaxModalZIndex () {
    return Math.max(...showedZIndexs);
  }

  export const TYPES = {
    INFO: "info",
    YES: "yes",
    CONFIRM: "confirm"
  };

  export default {
    name: "sds-modal",
    props: {
      show: Boolean,
      // confirm | info | yes | null
      type: String,
      title: String,
      // info | yes | confirm 有效
      formatTitle: [String, Number, Array],
      // info | success | error | warning
      status: {
        type: String,
        default: "info"
      },
      // 是否垂直居中显示
      centered: Boolean,
      zIndex: Number,
      // 点击遮罩层是否关闭模态框
      backdropClose: Boolean,
      okLoading: {
        type: Boolean,
        default: false
      },
      // 点击确定按钮时是否关闭模态框
      okClose: Boolean,
      // 是否支持键盘esc关闭
      keyboard: {
        type: Boolean,
        default: true
      },
      okBtnName: {
        type: String,
        default () {
          return this.$t("components.modal_sure")
        },
      },
      cancelBtnName: {
        type: String,
        default () {
          return this.$t("components.modal_cancel")
        },
      },
      okBtnProps: {
        type: Object,
        default () {
          return Object.create(null);
        }
      },
      cancelBtnProps: {
        type: Object,
        default () {
          return Object.create(null);
        }
      },
      // info | yes | confirm 有效
      infoMsg: String,
      width: String,
      // false时不渲染底部
      footer: {
        type: Boolean,
        default: true
      },
      draggable: {
        type: Boolean,
        default: true
      },
      autoAdjust: {
        type: Boolean,
        default: true
      },
      details: Array,
      destroyBodyHidden: {
        type: Boolean,
        default: true
      },
      // false时不渲染顶部
      header: {
        type: Boolean,
        default: true
      },
      dialogClass: String,
      dialogStyle: Object,
      bodyClass: String,
      bodyStyle: Object
    },
    provide () {
      return {
        rootModal: this,
      }
    },
    data () {
      return {
        dataZIndex: zIndex,
        hidden: false,
      }
    },
    created () {
      this.$eventBus.$on("resize", this.handleResize);
      this.adjustModalDebounce = debounce(this.adjustModal, 50, false);
    },
    mounted () {
      this.$eventBus.$on("keydown.esc", this.handleEscKeydown);
      this.$eventBus.$on("mouseup", this.handleMouseup);
      this.$eventBus.$on("mousemove", this.handleMousemove);
    },
    beforeDestroy () {
      this.$eventBus.$off("keydown.esc", this.handleEscKeydown);
      this.$eventBus.$off("resize", this.handleResize);
      this.$eventBus.$off("mouseup", this.handleMousemove);
      this.adjustModalDebounce = null;
    },
    watch: {
      show (val) {
        if (val) {
          this.dataZIndex = zIndex++;
          this.hidden = false;
          this.$emit("sds-modal-show");
        } else {
          this.$emit("sds-modal-hide");
        }
      },
    },
    computed: {
      computedZIndex () {
        if (this.zIndex) {
          return this.zIndex;
        }
        return this.dataZIndex;
      },
      computedOkBtnProps () {
        let btnProps = this.okBtnProps;
        btnProps = {
          loading: this.okLoading,
          type: "primary",
          ...btnProps
        };
        return btnProps;
      },
      computedCancelBtnProps () {
        let btnProps = this.cancelBtnProps;
        if (this.type === TYPES.INFO) {
          btnProps = { type: "primary", ...btnProps };
        }
        return btnProps;
      },
      isInfo () {
        return Object.keys(TYPES).some(key => {
          return TYPES[key] === this.type;
        })
      },
      infoIcon () {
        let icon = null;
        if (!this.isInfo) {
          return null;
        }
        let status = this.status;
        if (status === "info") {
          icon = "info-circle";
        } else if (status === "success") {
          icon = "check-circle";
        } else if (status === "warning") {
          icon = "sds-warning";
        } else if (status === "error") {
          icon = "sds-close-circle";
        }
        return icon;
      },
    },
    methods: {
      handleResize () {
        this.adjustModalDebounce.call(this);
      },
      adjustModal () {
        if (!this.show || !this.autoAdjust) {
          return;
        }
        let windowHeight = window.innerHeight;
        let modalHeight = this.$refs.modal.offsetHeight;
        let ajustVal = Math.floor((windowHeight - modalHeight) / 2);
        if (ajustVal > 0) {
          ajustVal = ajustVal - ajustVal / 3;
          this.$refs.modal.style.top = ajustVal + "px";
        }
        this.$refs.modal.style.left = "50%";
      },
      needHandle () {
        if (!this.show || this.computedZIndex !== getMaxModalZIndex()) {
          return false;
        }
        return true;
      },
      handleModalClose (e) {
        this.$emit("close", e);
        this.hide();
      },
      handleModalCancel (e) {
        this.$emit("cancel", e);
        this.hide();
      },
      handleModalConfirm (e) {
        if (this.type === TYPES.YES && !this.$refs.body.checkForm()) {
          return;
        }
        this.$emit("ok", e);
        this.okClose && this.hide();
      },
      handleModalBackdropClick () {
        this.backdropClose && this.hide();
      },
      handleEscKeydown (e) {
        if (this.keyboard && this.show) {
          this.handleModalClose(e);
        }
      },
      hide () {
        this.$emit('update:show', false);
      },
      enter (el) {
        this.$nextTick(this.adjustModal);
        this.$emit("sds-modal-enter");
      },
      // 进入transition css已过渡完成
      afterEnter (el) {
        showedZIndexs.push(this.computedZIndex);
        this.$emit("sds-modal-shown");
      },
      // 离开transition css已过渡完成
      afterLeave (el) {
        showedZIndexs.splice(showedZIndexs.indexOf(this.computedZIndex), 1);
        this.$emit("sds-modal-hidden");
        this.afterLeaveClear();
      },
      afterLeaveClear () {
        zIndex--;
        this.hidden = true;
      },
      renderHeader () {
        const h = this.$createElement;
        if (!this.header) {
          return null;
        }
        return h(
          SdsModalHeader,
          {
            props: {
              showCloseBtn: !this.isInfo,
              title: this.title,
              infoIcon: this.infoIcon
            },
            on: {
              "close-click": this.handleModalClose,
            },
            nativeOn: {
              mousedown: this.handleModalHeaderMousedown,
              mousemove: this.handleModalHeaderMousemove
            },
            scopedSlots: {
              title: () => {
                return this.$slots.title;
              }
            }
          },
          this.$slots.header
        )
      },
      renderBody () {
        const h = this.$createElement;
        if (this.destroyBodyHidden && this.hidden) {
          return null;
        }
        return h(
          SdsModalBody,
          {
            scopedSlots: {
              infoMsg: () => {
                return this.$slots.infoMsg;
              }
            },
            style: this.bodyStyle,
            class: [this.bodyClass],
            ref: "body"
          },
          this.$slots.default
        )
      },
      renderFooter () {
        const h = this.$createElement;
        if (!this.footer) {
          return null;
        }
        return h(
          SdsModalFooter,
          {
            on: {
              "cancel-click": this.handleModalCancel,
              "confirm-click": this.handleModalConfirm,
            }
          },
          this.$slots.footer,
        )
      },
      renderMask () {
        const h = this.$createElement;
        return h(
          "div",
          {
            class: [
              "sds-modal-backdrop"
            ],
            on: {
              click: this.handleModalBackdropClick
            }
          }
        )
      },
      handleMouseup (e) {
        if (!this.needHandle()) {
          return;
        }
        this.triggerDragElMousedown = false;
        this.triggerDragElMousemove = false;
        document.body.style.cursor = "auto";
      },
      handleMousemove (e) {
        if (!this.needHandle()) {
          return;
        }
        if (!this.triggerDragElMousedown || !this.triggerDragElMousemove) {
          return;
        }
        this.moveOffset(e);
      },
      handleModalHeaderMousedown (e) {
        this.startClientY = e.clientY;
        this.startClientX = e.clientX;
        this.triggerDragElMousedown = true;
      },
      handleModalHeaderMousemove (e) {
        if (!this.triggerDragElMousedown) {
          return;
        }
        this.triggerDragElMousemove = true;
        document.body.style.cursor = "move";
      },
      moveOffset (ev) {
        const moveClientY = ev.clientY;
        const moveClientX = ev.clientX;
        const modalEl = this.$refs.modal;
        const offsetTop = modalEl.offsetTop;
        const offsetLeft = modalEl.offsetLeft;
        const disClientY = moveClientY - this.startClientY;
        const disClientX = moveClientX - this.startClientX;
        const topVal = offsetTop + (disClientY);
        const leftVal = offsetLeft + (disClientX);
        modalEl.style.top = topVal + "px";
        modalEl.style.left = leftVal + "px";
        this.startClientY = moveClientY;
        this.startClientX = moveClientX;
        // 防止drag触发mouseup事件丢失
        pauseEvent(ev);
      },
    },
    render (h) {
      return h(
        "transition",
        {
          props: {
            name: "modal-fade",
          },
          on: {
            enter: this.enter,
            "after-enter": this.afterEnter,
            "after-leave": this.afterLeave
          },
        },
        [
          h(
            "div",
            {
              class: [
                "sds-modal-wrapper"
              ],
              style: {
                zIndex: this.computedZIndex
              },
              directives: [
                {
                  name: 'show',
                  value: this.show,
                }
              ],
            },
            [
              h(
                "div",
                {
                  class: [
                    "sds-modal",
                    this.dialogClass,
                    { "sds-modal-center": this.centered },
                    { [`sds-modal-info sds-modal-status-${this.status}`]: this.isInfo }
                  ],
                  style: {
                    ...this.dialogStyle,
                    width: this.width
                  },
                  attrs: {
                    role: "dialog",
                  },
                  ref: "modal"
                },
                [
                  h(
                    "div",
                    {
                      class: [
                        "sds-modal-content"
                      ]
                    },
                    [
                      this.renderHeader(),
                      this.renderBody(),
                      this.renderFooter()
                    ]
                  )
                ]
              ),
              this.renderMask()
            ]
          ),
        ]
      )
    },
  }
</script>
