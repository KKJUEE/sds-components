import Clipboard from './clipboard';
import SdsClipboardCopy from './SdsClipboardCopy';

/* istanbul ignore next */
Clipboard.install = function (Vue) {
  Vue.directive(Clipboard.name, Clipboard);
  Vue.component(SdsClipboardCopy.name, SdsClipboardCopy);
};

export default Clipboard;
