import SdsModal from "./SdsModal";
import Modal from "./modal";
SdsModal.install = function (Vue) {
  Vue.prototype.$modal = Modal;
  Vue.component(SdsModal.name, SdsModal);
};

export default SdsModal;
export {
  Modal
}
