import SdsEmptyRow from './sds-empty-row';
import SdsBoxSelect from './sds-box-select';
import SdsRectBox from './sds-rect-box';
import SdsDragNode from './sds-drag-node';
import SdsSelectLength from './sds-select-length';
import SdsFormTip from './sds-form-tip';

const directives = [
  SdsEmptyRow,
  SdsBoxSelect,
  SdsRectBox,
  SdsDragNode,
  SdsSelectLength,
  SdsFormTip
];
const install = function (Vue) {
  directives.forEach(directive => {
    Vue.use(directive);
  });
};
export default {
  install
}
