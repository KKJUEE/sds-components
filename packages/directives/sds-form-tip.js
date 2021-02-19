import { on, off } from 'element-ui/lib/utils/dom';

export default {
  install (Vue) {
    Vue.directive('sdsFormTip', {
      bind (el, binding, vnode) {
        el._focusHandle = () => {
          const elm = el.querySelector('.el-form-item__content');
          elm.classList.add('tip-wrapper');
          vnode.componentInstance.validateState = 'error';
          vnode.componentInstance.validateMessage = binding.value;
        }
        el._blurHandle = () => {
          const elm = el.querySelector('.el-form-item__content');
          elm.classList.remove('tip-wrapper');
        }
        on(el, 'focusin', el._focusHandle);
        on(el, 'focusout', el._blurHandle);
      },
      unbind (el) {
        off(el, 'focusin', el._focusHandle);
        off(el, 'focusout', el._blurHandle);
        delete el._focusHandle;
        delete el._blurHandle;
      }
    })
  }
}
