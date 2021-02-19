import { formatStr } from "../utils/utils";
import i18n from "../locale";

export default {
  install (Vue) {
    Vue.directive('sdsSelectLength', {
      bind (el) {
        el.wrapper = el.querySelector('.el-select__tags');
        el.searchBox = el.wrapper.querySelector('.el-select__input');
        el.selectedInfoBox = document.createElement('span');
        el.selectedInfoBox.className = 'select__text';
        el.wrapper.insertBefore(el.selectedInfoBox, el.searchBox);
      },
      update (el, binding) {
        const len = binding.value;
        el.selectedInfoBox.innerHTML = len ? `${formatStr(i18n.t('components.select_length'), len)}` : '';
      },
      unbind (el) {
        el.wrapper.removeChild(el.selectedInfoBox);
        delete el.wrapper;
        delete el.searchBox;
        delete el.selectedInfoBox;
      }
    })
  }
}
