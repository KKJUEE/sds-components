<script>
  import { Button } from 'element-ui';
  import { TYPES } from "./SdsModal";

  export default {
    name: "sds-modal-footer",
    inject: ["rootModal"],
    components: {
      Button
    },
    methods: {
      handleConfirmClick (e) {
        this.$emit('confirm-click', e);
      },
      handleCancelClick (e) {
        this.$emit('cancel-click', e);
      },
      renderOkBtn () {
        const h = this.$createElement;
        if (TYPES.INFO === this.rootModal.type) {
          return null;
        }
        const okProps = {
          on: {
            click: this.handleConfirmClick
          },
          props: this.rootModal.computedOkBtnProps,
        };
        return h(Button, okProps, [
          this.rootModal.okBtnName
        ]);
      },
      renderCancelBtn () {
        const h = this.$createElement;
        const cancelProps = {
          on: {
            click: this.handleCancelClick
          },
          props: this.rootModal.computedCancelBtnProps
        };
        return h(Button, cancelProps, [
          this.rootModal.cancelBtnName
        ]);
      },
    },
    render (h) {
      return h(
        "div",
        {
          class: [
            "sds-modal-footer"
          ]
        },
        this.$slots.default || [
          this.renderCancelBtn(),
          this.renderOkBtn(),
        ]
      );
    }
  }
</script>
