import Scrollbar from './scrollbar';

Scrollbar.install = function (Vue) {
  Vue.directive(Scrollbar.name, Scrollbar);
};

export default Scrollbar;
