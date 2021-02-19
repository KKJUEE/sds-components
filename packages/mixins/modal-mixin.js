import SdsModal from "../../packages/modal/SdsModal";
export default {
  components: {
    SdsModal
  },
  data () {
    return {
      modalShow: false
    }
  },
  methods: {
    show () {
      this.modalShow = true;
    }
  }
}
