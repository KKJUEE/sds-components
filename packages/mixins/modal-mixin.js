export default {
  props: {
    destroyAfterHidden: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      modalShow: false
    }
  },
  mounted () {
    if (this.destroyAfterHidden) {
      let modalIns = this.$children[0];
      modalIns.$on("sds-modal-hidden", () => {
        modalIns = null;
        this.$destroy();
      });
    }
  },
  methods: {
    showModal () {
      this.modalShow = true;
    }
  }
}
