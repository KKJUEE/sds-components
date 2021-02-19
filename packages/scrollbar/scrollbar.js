// https://github.com/mdbootstrap/perfect-scrollbar#how-to-use
import PerfectScrollbar from 'perfect-scrollbar';
import 'perfect-scrollbar/css/perfect-scrollbar.css';
import { isObject } from "../utils/utils";
import { addResizeListener, removeResizeListener } from "element-ui/lib/utils/resize-event";
import { on, off } from "element-ui/lib/utils/dom";
const DEFAULTS = {
  // When set to true, the scrollbar in X-axis will not be available, regardless of the content width.
  suppressScrollX: true,
  wheelSpeed: 1,
  // 是否启用滚动冒泡
  wheelPropagation: true,
  handlers: ['click-rail', 'drag-thumb', 'keyboard', 'wheel']
};
function updateScrollbar (el, binding) {
  let scrollbarOptions = {};
  let disabled, delay;
  binding = binding || {};
  const value = binding.value;
  isObject(value) && (scrollbarOptions = value);
  disabled = scrollbarOptions.disabled || value === false;
  delay = Number(scrollbarOptions.delay);
  if (disabled) {
    destory(el);
    return;
  }
  !el._ps_ && initScrollbar(el, binding);
  if (!Number.isNaN(delay)) {
    setTimeout(() => {
      el._ps_ && el._ps_.update();
    }, delay);
  } else {
    el._ps_.update();
  }
}

function initScrollbar (el, binding) {
  let endCall, disabled;
  let scrollbarOptions = {};
  const value = binding.value;
  isObject(value) && (scrollbarOptions = value);
  disabled = scrollbarOptions.disabled || value === false;
  if (disabled) {
    return;
  }
  endCall = scrollbarOptions.end || value;
  el._ps_ = new PerfectScrollbar(el, Object.assign({}, DEFAULTS, scrollbarOptions));
  if (typeof endCall === "function") {
    on(el, "ps-y-reach-end", endCall);
    el._ps_._end_cb = endCall;
  }
  el._ps_._updateHandle = () => {
    updateScrollbar(el);
  };
  addResizeListener(el, el._ps_._updateHandle);
}
function destory (el) {
  if (!el._ps_) {
    return;
  }
  removeResizeListener(el, el._ps_._updateHandle);
  off(el, "ps-y-reach-end", el._ps_._end_cb);
  el._ps_._updateHandle = null;
  el._ps_._end_cb = null;
  el._ps_.destroy();
  el._ps_ = null;
}

export default {
  name: "scrollbar",
  inserted (el, binding, vnode) {
    const positions = ['fixed', 'absolute', 'relative'];
    let position = window.getComputedStyle(el).position;
    if (positions.indexOf(position) === -1) {
      el.style.position = "relative";
    }
    el.style.overflow = "hidden";
    initScrollbar(el, binding);
  },
  componentUpdated (el, binding, vnode, oldVnode) {
    try {
      updateScrollbar(el, binding);
    } catch (error) {
      console.error(error);
    }
  },
  unbind (el, binding, vnode) {
    destory(el);
  }
}
