import Clipboard from "./clipboard";
import Scrollbar from "./scrollbar";
import DetailLayout from "./detailLayout";
import Echarts from "./echarts";
import Empty from "./empty";
import icon from "./icon";
import BreadcrumbBar from "./breadcrumbBar";
import Modal from "./modal";
import Input from "./input";
import DetailCollapse from "./detailCollapse"
import SdsTable from "./table";
import SdsDropdownBtn from './dropdownBtn'
import { SdsBaseSet, SdsBaseSetItem } from './baseSet'
import Steps from "./steps";
import Tree from "./tree";
import Result from "./result";
import Tag from "./tag";
import SdsSelect from "./select";
import SdsCollapse from "./collapse";
import "./notification/SdsNotification";
import SdsActionBar from "./topActionBar";
import SdsPagination from "./pagination";
import "./assets/index.js"
import "./constants/index.js"
import "./mixins/index.js"
import "./utils/index.js"
import "./locale/index.js"
import "./directives/index.js"
const components = [
  Clipboard,
  Scrollbar,
  DetailLayout,
  Echarts,
  Empty,
  icon,
  BreadcrumbBar,
  Modal,
  DetailCollapse,
  Input,
  SdsTable,
  SdsDropdownBtn,
  SdsBaseSet,
  SdsBaseSetItem,
  Steps,
  Tree,
  Result,
  Tag,
  SdsSelect,
  SdsCollapse,
  SdsActionBar,
  SdsPagination
];
const install = function (Vue) {
  components.forEach(component => {
    Vue.use(component);
  });
};
export default {
  install
}
