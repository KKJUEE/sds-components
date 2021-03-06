import Vue from "vue";
import i18n from "../locale"
import SdsModal, { TYPES } from "./SdsModal";
import { isVNode, noop } from "../utils/utils";
import modalMixin from "@/mixins/modal-mixin";
const ModalConstructor = Vue.extend(SdsModal);

const DEFAULT_OPTIONS = {
  title: "",
  infoMsg: "",
  content: "",
  centered: false,
  zIndex: null,
  width: "420px",
  backdropClose: false,
  okLoading: false,
  okClose: true,
  keyboard: true,
  okBtnProps: {},
  cancelBtnProps: {},
  draggable: true,
  autoAdjust: true,
  onOk: noop,
  onCancel: noop,
  onShown: noop,
  onHidden: noop,
};

function Modal (externalModal, options = {}) {
  let Constructor = ModalConstructor;
  if (externalModal) {
    Constructor = Vue.extend(externalModal);
  } else {
    options = Object.assign({}, DEFAULT_OPTIONS, options);
  }
  if (isVNode(options.infoMsg)) {
    options._vnodeInfoMsg = [options.infoMsg];
    options.infoMsg = null;
  }
  if (isVNode(options.title)) {
    options._vnodeTitle = [options.title];
    options.title = null;
  }
  if (isVNode(options.footer)) {
    options._vnodeFooter = [options.footer];
    options.footer = !!options.footer;
  }
  const listeners = options.on;
  delete options.on;
  let instance = new Constructor({
    i18n,
    store: Modal.store,
    propsData: options,
    _parentListeners: listeners,
    mixins: externalModal ? [modalMixin] : null,
    methods: {
      update (newOptions = {}) {
        let keys, len, i, key;
        keys = Object.keys(newOptions);
        len = keys.length;
        for (i = 0; i < len; i++) {
          key = keys[i];
          this[key] = newOptions[key];
        }
      }
    }
  });
  if (externalModal) {
    instance.$mount();
    instance.showModal();
    return instance;
  }
  instance.$slots.infoMsg = options._vnodeInfoMsg;
  instance.$slots.title = options._vnodeTitle;
  instance.$slots.footer = options._vnodeFooter;
  let content = options.content;
  if (typeof content === "function") {
    content = content(instance.$createElement, instance);
  } else if (content && !isVNode(content)) {
    content = instance._v(content);
  }
  content && (instance.$slots.default = [content]);
  instance.$on("ok", () => {
    const result = options.onOk();
    instance._okClose = instance.okClose;
    if (result instanceof Promise) {
      instance.okClose = false;
      instance.okLoading = true;
      result
        .then((ret) => {
          instance.okClose = instance._okClose;
          if (instance.okClose && ret !== false) {
            instance.hide();
          }
        })
        .finally(() => {
          instance.okLoading = false;
        })
    }
  });
  instance.$on("cancel", options.onCancel);
  instance.$on("update:show", (val) => {
    instance.show = val;
  });
  instance.$on("sds-modal-shown", options.onShown);
  instance.$on("sds-modal-hidden", () => {
    options.onHidden();
    instance.$el.parentNode.removeChild(instance.$el);
    instance.$destroy();
    instance = null;
  });
  instance.$mount();
  // mount时已append to body,不需要重复append
  !instance.appendToBody && document.body.appendChild(instance.$el);
  instance.show = true;
  return instance;
}

Object.assign(Modal, {
  info (options = {}) {
    options = {
      cancelBtnName: i18n.t("components.modal_understand"),
      okClose: true,
      ...options,
      type: TYPES.INFO
    };
    return Modal.call(this, null, options);
  },
  yes (options = {}) {
    options = {
      okClose: true,
      cancelBtnName: i18n.t("components.modal_no"),
      okBtnName: i18n.t("components.modal_yes"),
      ...options,
      type: TYPES.YES
    };
    return Modal.call(this, null, options);
  },
  confirm (options = {}) {
    options = {
      okClose: true,
      cancelBtnName: i18n.t("components.modal_no"),
      okBtnName: i18n.t("components.modal_yes"),
      ...options,
      type: TYPES.CONFIRM
    };
    return Modal.call(this, null, options);
  },
  registerStore (store) {
    this.store = store;
  },
});
export default Modal;
