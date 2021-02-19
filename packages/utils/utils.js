import {
  Notification
} from 'element-ui';

const UA = window.navigator.userAgent.toLowerCase();
function noop () {}

function isString (str) {
  return Object.prototype.toString.call(str) === '[object String]'
}

function isObject (obj) {
  return Object.prototype.toString.call(obj) === '[object Object]'
}

function isArray (array) {
  return Object.prototype.toString.call(array) === '[object Array]'
}

function isDefined (val) {
  return val !== undefined && val !== null;
}

function isUnDefined (val) {
  return val === undefined || val === null;
}

function isEmpty (val) {
  if (!isDefined(val)) {
    return true;
  }
  const type = Object.prototype.toString.call(val);
  if (type === "[object String]" || type === "[object Array]") {
    return val.length === 0;
  }
  if (type === "[object File]" || type === "[object Map]" ||
    type === "[object Set]") {
    return val.size === 0;
  }
  if (type === "[object Object]") {
    return Object.keys(val).length === 0;
  }
  return false;
}

function isEqual (target, src) {
  const targetType = typeof target;
  const srcType = typeof src;
  if (targetType !== srcType) {
    return false;
  }
  if (targetType !== "object" || src !== "object") {
    return targetType === srcType;
  }
  const srcKeys = Object.keys(src || {});
  const targetKeys = Object.keys(target || {});
  if (srcKeys.length !== targetKeys.length) {
    return false;
  }
  return srcKeys.every(key => {
    return isEqual(target[key], src[key]);
  });
}

function isVNode (vnode) {
  return vnode !== null && typeof vnode === 'object' &&
    vnode.hasOwnProperty("componentOptions");
}

function pauseEvent (e) {
  e.stopPropagation && e.stopPropagation();
  e.preventDefault && e.preventDefault();
  e.cancelBubble = true;
  e.returnValue = false;
  return false;
}

function formatStr (str, ...arg) {
  if (arg.length === 0) {
    return str;
  }
  return str.replace(/\{(\d+)\}/g, function (m, i) {
    return arg[i];
  });
}

function isIE () {
  return UA && /msie|trident/.test(UA);
}

function isEdge () {
  return UA && UA.indexOf('edge/') > 0;
}

function toPercent (value, digit) {
  digit = digit || 2;
  if (!value) {
    return value;
  }
  return (parseInt(value) / 100).toFixed(digit) + '%';
}

// 深度合并
function mergeOptions (...args) {
  let target, source, len, i, key, keys, keyLen, keyVal, clone;
  len = args.length;
  target = args[0];
  i = 1;
  if (!isObject(target) && !Array.isArray(target)) {
    return target;
  }
  for (; i < len; i++) {
    source = args[i];
    if (!isObject(source) && !Array.isArray(target)) {
      continue;
    }
    keys = Object.keys(source);
    keyLen = keys.length;
    for (let j = 0; j < keyLen; j++) {
      key = keys[j];
      keyVal = source[key];
      if (isObject(keyVal) || Array.isArray(keyVal)) {
        if (Array.isArray(keyVal) && !Array.isArray(target[key])) {
          clone = []
        } else if (isObject(keyVal) && !isObject(target[key])) {
          clone = {};
        } else {
          clone = target[key];
        }
        target[key] = mergeOptions(clone, keyVal);
      } else {
        target[key] = keyVal;
      }
    }
  }
  return target;
}

// 防抖函数
// 默认：对于不超过delay时间间隔的持续触发事件，只在最后事件停止触发时的delay时间后执行一次
// immediate: 对于不超过delay时间间隔的持续触发事件，只在一开始事件触发时执行一次
function debounce (fn, delay, options) {
  let timer, result;
  delay = delay || 200;
  const immediate = isObject(options) ? options.immediate : options === true;
  return function (...arg) {
    !!timer && clearTimeout(timer);
    if (immediate && !timer) {
      result = fn.apply(this, arg);
    }
    timer = setTimeout(() => {
      immediate ? (timer = null) : fn.apply(this, arg);
    }, delay);
    return result;
  }
}

// 节流函数：对于持续触发事件，delay时间内只执行一次
function throttle (fn, delay, options) {
  let timer;
  let lastTime = 0;
  delay = delay || 200;
  // 事件中断时距离上一次执行不足delay时是否再执行一次
  const breakMask = isObject(options) ? options.break : options === true;
  return function (...arg) {
    const nowTime = Date.now();
    const diff = nowTime - lastTime;
    !!timer && clearTimeout(timer);
    if (diff >= delay) {
      fn.apply(this, arg);
      lastTime = nowTime;
    } else if (breakMask) {
      timer = setTimeout(() => {
        fn.apply(this, arg);
      }, delay);
    }
  }
}

function upperFirstLetter (str) {
  str = str || "";
  return str.replace(/\b(\w)|\s(\w)/g, function (m) {
    return m.toUpperCase();
  })
}

function handleRequestError (error, message) {
  if (error.response) {
    if ([403, 500, 401].includes(error.response.status)) {
      return;
    }
  }
  if (error.message === 'Network Error') {
    return;
  }
  Notification({
    message: message || error.message,
    type: 'error'
  });
}

function sort (obj1, obj2, key) {
  return obj1[key] - obj2[key]
}
/*
*  @params { Object } source
*  @ return { Object }
* */
function deepClone (source) {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments', 'deepClone')
  }
  const targetObj = source.constructor === Array ? [] : {}
  Object.keys(source).forEach(keys => {
    if (source[keys] && typeof source[keys] === 'object') {
      targetObj[keys] = deepClone(source[keys])
    } else {
      targetObj[keys] = source[keys]
    }
  })
  return targetObj
}

function formatCapacityToUnitObj (value, decimal) {
  return capacityToUnitObj(value, decimal)
}

function capacityToUnitObj (value, decimal) {
  decimal = !decimal && decimal !== 0 ? 2 : decimal
  if (!value || !toNumber(value)) {
    return { size: 0, unit: 'B' }
  }
  let negative = false
  if (toNumber(value) < 0) {
    negative = true
  }
  value = Math.abs(value)
  let unit = 'B';
  let digit = Math.log2(value);
  let unitIndex = Math.floor(digit / 10);
  let unitList = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
  if (unitIndex > 5) {
    unitIndex = 5;
  }
  if (decimal === 0) {
    while (unitIndex > 1) {
      if (value % Math.pow(1024, unitIndex) !== 0) {
        unitIndex--
      } else {
        break
      }
    }
  }
  unit = unitList[unitIndex];
  value = (value / Math.pow(1024, unitIndex)).toFixed(decimal);
  return { size: negative ? -value : value, unit: unit }
}

function toNumber (value) {
  return Number(value)
}

export {
  noop,
  isDefined,
  isUnDefined,
  isObject,
  isArray,
  isEmpty,
  isEqual,
  isVNode,
  pauseEvent,
  formatStr,
  isIE,
  isEdge,
  toPercent,
  isString,
  mergeOptions,
  debounce,
  throttle,
  upperFirstLetter,
  handleRequestError,
  sort,
  deepClone,
  formatCapacityToUnitObj
}
