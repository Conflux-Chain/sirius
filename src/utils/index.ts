import BigNumber from 'bignumber.js';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import fetch from './request';
import { Buffer } from 'buffer';
import { NetworksType } from './hooks/useGlobal';
import {
  IS_PRE_RELEASE,
  NETWORK_ID,
  NETWORK_TYPE,
  NETWORK_TYPES,
  getCurrencySymbol,
  HIDE_IN_DOT_NET,
  RPC_SERVER,
} from 'utils/constants';
import SDK from 'js-conflux-sdk/dist/js-conflux-sdk.umd.min.js';
import pubsub from './pubsub';
import lodash from 'lodash';
import { ENSInfoItemType } from 'utils/hooks/useENS';
import { Nametag } from 'utils/hooks/useNametag';

dayjs.extend(relativeTime);

/**
 * Used to cache address-related function calls provided by js-conflux-sdk, because address operations are expensive and time-consuming
 * For example:
 * {
 *    "formatAddress(cfxtest:aam833gphcp7ruyv7ncwmead0f4p1x1f0yzrp8tz1t, base32)": "cfxtest:aam833gphcp7ruyv7ncwmead0f4p1x1f0yzrp8tz1t"
 * }
 */
const ADDRESS_FUNC_CACHE = {};

export const isPosAddress = (address: string): boolean => {
  try {
    return address.startsWith('0x') && address.length === 66;
  } catch (e) {
    return false;
  }
};

export const isCfxHexAddress = (address: string): boolean => {
  const CACHE_KEY = `isCfxHexAddress(${address})`;
  if (ADDRESS_FUNC_CACHE[CACHE_KEY]) return ADDRESS_FUNC_CACHE[CACHE_KEY];

  let result = false;

  try {
    result = SDK.address.isValidCfxHexAddress(address);
  } catch (e) {}

  ADDRESS_FUNC_CACHE[CACHE_KEY] = result;

  return result;
};

export const isBase32Address = (address: string): boolean => {
  const CACHE_KEY = `isBase32Address(${address})`;
  if (ADDRESS_FUNC_CACHE[CACHE_KEY]) return ADDRESS_FUNC_CACHE[CACHE_KEY];

  let result = false;

  try {
    result = SDK.address.isValidCfxAddress(address);
  } catch (e) {}

  ADDRESS_FUNC_CACHE[CACHE_KEY] = result;

  return result;
};

export const formatAddress = (
  address: string,
  outputType = 'base32', // base32 or hex
): string => {
  const CACHE_KEY = `formatAddress(${address}, ${outputType})`;
  if (ADDRESS_FUNC_CACHE[CACHE_KEY]) return ADDRESS_FUNC_CACHE[CACHE_KEY];

  let result = address;

  try {
    if (isCfxHexAddress(address)) {
      if (outputType === 'base32') {
        result = SDK.format.address(address, NETWORK_ID);
      }
    } else if (isBase32Address(address)) {
      if (outputType === 'hex') {
        result = SDK.format.hexAddress(address);
      } else if (outputType === 'base32') {
        const reg = /(.*):(.*):(.*)/;
        // compatibility with verbose address, will replace with simply address later
        if (typeof address === 'string' && reg.test(address)) {
          result = address.replace(reg, '$1:$3').toLowerCase();
        }
      }
    }
  } catch (e) {}

  ADDRESS_FUNC_CACHE[CACHE_KEY] = result;

  return result;
};

export const getAddressInfo = (
  address: string,
): {
  netId: number;
  type: string;
  hexAddress: ArrayBuffer | string;
} | null => {
  const CACHE_KEY = `getAddressInfo(${address})`;
  if (ADDRESS_FUNC_CACHE[CACHE_KEY]) return ADDRESS_FUNC_CACHE[CACHE_KEY];

  let result = null;

  try {
    if (isCfxHexAddress(address)) {
      const base32Address = formatAddress(address, 'base32');
      result = SDK.address.decodeCfxAddress(base32Address);
    } else if (isBase32Address(address)) {
      result = SDK.address.decodeCfxAddress(address);
    }
  } catch (e) {}

  ADDRESS_FUNC_CACHE[CACHE_KEY] = result;

  return result;
};

export const isSimplyBase32Address = (address: string): boolean => {
  const CACHE_KEY = `isSimplyBase32Address(${address})`;
  if (ADDRESS_FUNC_CACHE[CACHE_KEY]) return ADDRESS_FUNC_CACHE[CACHE_KEY];

  let result = false;

  try {
    result =
      SDK.address.isValidCfxAddress(address) &&
      SDK.address.simplifyCfxAddress(address) === address;
  } catch (e) {}

  ADDRESS_FUNC_CACHE[CACHE_KEY] = result;

  return result;
};

// support hex and base32
export const isAddress = (address: string): boolean => {
  try {
    if (address.startsWith('0x')) {
      return isCfxHexAddress(address);
    } else {
      return isBase32Address(address);
    }
  } catch (e) {
    return false;
  }
};

export function isZeroAddress(address: string): boolean {
  const CACHE_KEY = `isZeroAddress(${address})`;
  if (ADDRESS_FUNC_CACHE[CACHE_KEY]) return ADDRESS_FUNC_CACHE[CACHE_KEY];

  let result = false;

  try {
    // @todo, wait for sdk upgrade to accept both base32 and hex address
    result = SDK.address.isZeroAddress(formatAddress(address, 'hex'));
  } catch (e) {}

  ADDRESS_FUNC_CACHE[CACHE_KEY] = result;

  return result;
}

export function isAccountAddress(address: string): boolean {
  return getAddressInfo(address)?.type === 'user' || isZeroAddress(address);
}

export function isContractAddress(address: string): boolean {
  return getAddressInfo(address)?.type === 'contract';
}

export function isInnerContractAddress(address: string): boolean {
  const CACHE_KEY = `isInnerContractAddress(${address})`;
  if (ADDRESS_FUNC_CACHE[CACHE_KEY]) return ADDRESS_FUNC_CACHE[CACHE_KEY];

  let result = false;

  try {
    result = SDK.address.isInternalContractAddress(
      formatAddress(address, 'hex'),
    );
  } catch (e) {}

  ADDRESS_FUNC_CACHE[CACHE_KEY] = result;

  return result;
}

// address start with 0x0, not valid internal contract, but fullnode support
export function isSpecialAddress(address: string): boolean {
  const CACHE_KEY = `isSpecialAddress(${address})`;
  if (ADDRESS_FUNC_CACHE[CACHE_KEY]) return ADDRESS_FUNC_CACHE[CACHE_KEY];

  let result =
    getAddressInfo(address)?.type === 'builtin' &&
    !isInnerContractAddress(address);

  ADDRESS_FUNC_CACHE[CACHE_KEY] = result;

  return result;
}

export function isCurrentNetworkAddress(address: string): boolean {
  return getAddressInfo(address)?.netId === NETWORK_ID;
}

/**
 * format util fn
 */

export const tranferToLowerCase = (str: string) => {
  return str ? str.toLowerCase() : '';
};

function hex2asc(pStr) {
  let tempstr = '';
  for (let b = 0; b < pStr.length; b += 2) {
    tempstr += String.fromCharCode(parseInt(pStr.substr(b, 2), 16));
  }
  return tempstr;
}

export const hex2utf8 = pStr => {
  let tempstr = '';
  try {
    tempstr = decodeURIComponent(
      pStr.replace(/\s+/g, '').replace(/[0-9a-f]{2}/g, '%$&'),
    );
  } catch (err) {
    tempstr = hex2asc(pStr);
  }
  return tempstr;
};

export const toThousands = (num, delimiter = ',', prevDelimiter = ',') => {
  if ((typeof num !== 'number' || isNaN(num)) && typeof num !== 'string')
    return '';
  let str = num + '';
  return str
    .replace(new RegExp(prevDelimiter, 'igm'), '')
    .split('.')
    .reduce((acc, cur, index) => {
      if (index) {
        return `${acc}.${cur}`;
      } else {
        return cur.replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, `$1${delimiter}`);
      }
    }, '');
};

export const getEllipsStr = (str: string, frontNum: number, endNum: number) => {
  if (str) {
    const length = str.length;
    if (endNum === 0 && length <= frontNum) {
      return str.substring(0, frontNum);
    }
    return (
      str.substring(0, frontNum) +
      '...' +
      str.substring(length - endNum, length)
    );
  }
  return '';
};

// alternative of String.prototype.replaceAll
export const replaceAll = (str: string, find: string, replace) => {
  return str.replace(
    new RegExp(find.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&'), 'g'),
    replace,
  );
};

/**
 * 格式化字符串，向下取整
 * @param {number|string} num 数字或字符串，应尽量使用字符串格式，数字格式如果长度超过 Number.MAX_SAFE_INTEGER 或 Number.MIN_SAFE_INTEGER 可能会有精度损失
 * @param {object} opt 配置参数
 * @returns {string} 格式化后字符串格式数字
 * @todo: 支持四舍五入，向上取整
 * @todo: 支持整数位小数设置精度
 * @todo: 支持负数格式化
 */
export const formatNumber = (num, opt?) => {
  // 无法通过 bignumber.js 格式化的不处理
  let bNum = new BigNumber(num).toFixed();
  if (bNum === 'NaN') {
    return '';
  }
  const option = {
    precision: 3, // 保留小数精度数（注意整数位小数的精度固定为 3，原因是受千分符影响）
    keepDecimal: true, // 是否保留小数位（注意如果整数部分带有小数位，则不保留实际小数位，原因是会显示两个小数点，会误解）
    keepZero: false, // 是否保留小数位的 0（注意此配置优先级高于 precision，会清除 precision 添加的 0）
    delimiter: ',', // 自定义分隔符
    withUnit: true, // 是否显示单位
    unit: '', // 指定单位
    ...opt,
  };
  // 0. 定义返回值
  let int = '';
  let decimal = '';
  let result = '';
  /**
   * 1. 定义单位
   * K - kilo, 10³
   * M - mega, 10⁶
   * G - giga, 10⁹
   * T - tera, 10¹²
   * P - peta, 10¹⁵
   * E - exa, 10¹⁸
   * Z - zetta, 10²¹
   * Y - yotta, 10²⁴
   */
  const UNITS = ['', 'K', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y'];
  // 2. 拆分出整数和小数，小数默认值为 0
  const [intStr, decimalStr = '0'] = bNum.split('.');
  // 3. 只能处理 27 位数的单位，大于 27 位的字符串从头部截断保留
  // 3.1 获取大于小数点前 27 位的数字 intStrFront
  let intStrFront = intStr.slice(-Infinity, -27);
  // 3.2 获取小数点前 27 位数字 intStrEnd
  let intStrEnd = intStr.slice(-27);
  // 4. intStrEnd 转千分符形式
  const intStrEndAfterToThousands = toThousands(intStrEnd, option.delimiter);
  // 5. intStrEnd 添加单位，此处不对数字有效性做验证，即可能值为 100.000，100.000k 或 000.000Y
  let intStrEndWithUnit = '';

  if (option.withUnit === false) {
    intStrEndWithUnit = intStrEndAfterToThousands;
  } else {
    let unitIndex = 1;
    if (option.unit !== '' && UNITS.includes(option.unit)) {
      unitIndex =
        intStrEndAfterToThousands.split(option.delimiter).length -
        UNITS.findIndex(u => u === option.unit);
    }
    if (unitIndex > 0) {
      intStrEndWithUnit = intStrEndAfterToThousands
        .split(option.delimiter)
        .reduce((prev, curr, index, arr) => {
          const len = arr.length;
          // 无单位整数，为了后面方便处理统一格式
          if (len === 1) {
            return `${curr}.000`;
          }
          if (index === 0) {
            return curr;
          } else if (index === unitIndex) {
            return `${prev}.${curr}${UNITS[len - index]}`;
          } else if (index < unitIndex) {
            return `${prev},${curr}`;
          } else {
            return prev;
          }
        }, '');
    } else {
      intStrEndWithUnit = intStrEndAfterToThousands;
    }
  }
  // 6. 格式化整数
  if (intStrFront) {
    // 如果数字长度超过 27 位，则前面的数字用千分符分割
    int = `${toThousands(intStrFront, option.delimiter)}${
      option.delimiter
    }${intStrEndWithUnit}`;
  } else {
    int = intStrEndWithUnit;
  }
  // 7. 格式化小数
  decimal = new BigNumber(`0.${decimalStr}`).toPrecision(option.precision, 1);
  // 8. 拼接整数，小数和单位
  let unit = int.slice(-1);
  let intWithoutUnit = int;
  if (int && UNITS.includes(unit)) {
    // 8.1 整数位包含单位，则不显示实际小数部分
    if (option.keepDecimal) {
      // 保留整数位整数 + 整数位小数
      intWithoutUnit = int.slice(-Infinity, -1);
    } else {
      // 仅保留整数位整数
      intWithoutUnit = intWithoutUnit.split('.')[0];
    }
    result = `${intWithoutUnit}${unit}`;
  } else {
    unit = '';
    // 8.2 整数位为 0 或无单位整数，拼接小数位
    if (option.keepDecimal) {
      result = new BigNumber(int.toString().replace(/,/g, ''))
        .plus(new BigNumber(decimal))
        .toFixed(option.precision, 1);
    } else {
      result = int.split('.')[0];
    }
    intWithoutUnit = result;
  }
  // 9. 处理小数部分的 0
  if (!option.keepZero) {
    result = `${new BigNumber(
      replaceAll(intWithoutUnit, option.delimiter, ''),
    ).toFormat()}${unit}`;
  }
  // 10. 格式化千分符
  result = toThousands(result);
  return result;
};

/**
 * 格式化字符串
 * @param {string} str
 * @param {string} type 可能取值为：tag - contract name tag, hash, address; 如果 type 为数字，则截取对应数字 + ...，默认值为 12
 */
export const formatString = (
  str: string,
  type?:
    | 'tag'
    | 'hash'
    | 'address'
    | 'tokenTracker'
    | 'posAddress'
    | 'hexAddress'
    | number,
) => {
  let result: string;
  switch (type) {
    case 'tag':
      result = getEllipsStr(str, 14, 0);
      break;
    case 'hash':
      result = getEllipsStr(str, 10, 0);
      break;
    case 'address':
      result = getEllipsStr(str, 6, 4);
      break;
    case 'tokenTracker':
      result = getEllipsStr(str, 24, 0);
      break;
    case 'posAddress':
      result = getEllipsStr(str, 10, 0);
      break;
    case 'hexAddress':
      result = getEllipsStr(str, 6, 4);
      break;
    default:
      let num = 12;
      if (typeof type === 'number') num = type;
      if (str.length > num) {
        result = getEllipsStr(str, num, 0);
      } else {
        result = str;
      }
  }
  return result;
};

/**
 * 获取给定时间戳 from 到给定时间 to 的 duration
 * @param {string | number} from syncTimestamp
 * @param {string | number} to current serverTimestamp or current browserTimestamp
 */
export const getDuration = (pFrom: number, pTo?: number) => {
  try {
    const to = pTo || +new Date();
    const from = pFrom * 1000;

    if (from > to) {
      throw new Error('invalid timestamp pair');
    }

    const dayjsTo = dayjs(to);

    const fullDay = dayjsTo.diff(from, 'day');
    const fullHour = dayjsTo.diff(from, 'hour');
    const fullMinute = dayjsTo.diff(from, 'minute');

    const day = dayjsTo.diff(from, 'day');
    const hour = dayjsTo.subtract(fullDay, 'day').diff(from, 'hour');
    const minute = dayjsTo.subtract(fullHour, 'hour').diff(from, 'minute');
    const second = dayjsTo.subtract(fullMinute, 'minute').diff(from, 'second');

    return [day, hour, minute, second];
  } catch (e) {
    return [0, 0, 0, 0];
  }
};

/**
 *
 * @param num original number
 * @param isShowFull Whether to show all numbers
 */
export const fromDripToCfx = (
  num: number | string,
  isShowFull: boolean = false,
  _opt = {},
) => {
  const opt = {
    minNum: 0.001,
    ..._opt,
  };
  const bn = new BigNumber(num);
  let result: string = '0';
  if (!window.isNaN(bn.toNumber()) && bn.toNumber() !== 0) {
    const divideBn = bn.dividedBy(10 ** 18);
    if (isShowFull) {
      result = toThousands(divideBn.toFixed());
    } else {
      result = divideBn.lt(opt.minNum)
        ? '< ' + new BigNumber(opt.minNum).toString()
        : formatNumber(divideBn.toFixed(), opt);
    }
  }
  return result;
};

/**
 *
 * @param num original number
 * @param isShowFull Whether to show all numbers
 */
export const fromDripToGdrip = (
  num: number | string,
  isShowFull: boolean = false,
  _opt = {},
) => {
  const opt = {
    minNum: 0.001,
    ..._opt,
  };
  const bn = new BigNumber(num);
  let result: string = '0';
  if (!window.isNaN(bn.toNumber()) && bn.toNumber() !== 0) {
    const divideBn = bn.dividedBy(10 ** 9);
    if (isShowFull) {
      result = toThousands(divideBn.toFixed());
    } else {
      result = divideBn.lt(opt.minNum)
        ? '< ' + new BigNumber(opt.minNum).toString()
        : formatNumber(divideBn.toFixed(), opt);
    }
  }
  return `${result}`;
};

export const fromGdripToDrip = (num: number | string) =>
  new BigNumber(num).multipliedBy(10 ** 9);

export const fromCfxToDrip = (num: number | string) =>
  new BigNumber(num).multipliedBy(10 ** 18);

export const getPercent = (
  divisor: number | string,
  dividend: number | string,
  precision?: number,
) => {
  if (Number(dividend) === 0) return 0 + '%';
  const bnDivisor = new BigNumber(divisor);
  const bnDividend = new BigNumber(dividend);
  const percentageNum = formatNumber(
    bnDivisor.dividedBy(bnDividend).multipliedBy(100).toNumber(),
  );
  if (precision || precision === 0) {
    const percentageNumPrecision = roundToFixedPrecision(
      percentageNum,
      precision,
    );
    if (percentageNumPrecision === '100.00') {
      return '100%';
    } else if (percentageNumPrecision === '0.00') {
      return '0%';
    }
    return roundToFixedPrecision(percentageNum, precision) + '%';
  }

  return `${percentageNum}%`;
};

export const roundToFixedPrecision = (
  number: number | string,
  precision: number,
  method: string = 'ROUND',
) => {
  const numberFormat = typeof number === 'number' ? number : parseFloat(number);
  const factor = Math.pow(10, precision);
  let resultNum: number;

  switch (method) {
    case 'FLOOR':
      resultNum = Math.floor(numberFormat * factor) / factor;
      break;
    case 'CEIL':
      resultNum = Math.ceil(numberFormat * factor) / factor;
      break;
    case 'ROUND':
    default:
      resultNum = Math.round((numberFormat + Number.EPSILON) * factor) / factor;
  }
  return resultNum.toFixed(precision);
};

export const formatTimeStamp = (
  time: number,
  type?: 'standard' | 'timezone',
) => {
  let result: string;
  try {
    switch (type) {
      case 'standard':
        result = dayjs(time).format('YYYY-MM-DD HH:mm:ss');
        break;
      case 'timezone':
        result = dayjs(time).format('YYYY-MM-DD HH:mm:ss Z');
        break;
      default:
        result = dayjs(time).format('YYYY-MM-DD HH:mm:ss');
    }
  } catch (error) {
    result = '';
  }
  return result;
};

export const formatBalance = (
  balance,
  decimals = 18,
  isShowFull = false,
  opt = {},
  ltValue?,
) => {
  try {
    const num = new BigNumber(balance).div(new BigNumber(10).pow(decimals));
    if (num.eq(0)) {
      return num.toFixed();
    }
    if (isShowFull) {
      return toThousands(num.toFixed());
    }
    if (ltValue && num.lt(ltValue)) {
      return `<${ltValue}`;
    }
    return formatNumber(num.toString(), opt);
  } catch {
    return '';
  }
};

interface BodyElement extends HTMLBodyElement {
  createTextRange?(): Range;
}

export const selectText = (element: HTMLElement) => {
  var range,
    selection,
    body = document.body as BodyElement;
  if (body.createTextRange) {
    range = body.createTextRange();
    range.moveToElementText(element);
    range.select();
  } else if (window.getSelection) {
    selection = window.getSelection();
    range = document.createRange();
    range.selectNodeContents(element);
    selection.removeAllRanges();
    selection.addRange(range);
  }
};

export const isHash = (str: string) => {
  return /^0x[0-9a-fA-F]{64}$/.test(str);
};

export const isBlockHash = async (str: string) => {
  if (!isHash(str)) return false;
  let isBlock = true;
  try {
    const block = await fetch(`/v1/block/${str}`);
    // server side will return {} when no block found
    if (!block.hash || block.code !== undefined) isBlock = false;
  } catch (err) {
    isBlock = false;
  }

  return isBlock;
};

export const isTxHash = async (str: string) => {
  if (!isHash(str)) return false;
  return !isBlockHash(str);
};

// Is input match epoch number format
// 0x??? need to convert to decimal int
export function isEpochNumber(str: string) {
  var n = Math.floor(Number(str));
  return n !== Infinity && String(n) === str && n >= 0;
}

export function validURL(str: string) {
  var pattern = new RegExp(
    '^(https?:\\/\\/)?' + // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$',
    'i',
  ); // fragment locator
  return !!pattern.test(str);
}

export function byteToKb(bytes) {
  return bytes / 1024;
}

export function isObject(o) {
  return o !== null && typeof o === 'object' && Array.isArray(o) === false;
}

export function checkInt(value, type) {
  const num = Number(type.substr(3));
  const min = new BigNumber(2).pow(num - 1).multipliedBy(-1);
  const max = new BigNumber(2).pow(num - 1).minus(1);
  let isType = false;
  if (!isNaN(value)) {
    const valNum = new BigNumber(value);
    if (
      valNum.isInteger() &&
      valNum.isGreaterThanOrEqualTo(min) &&
      valNum.isLessThanOrEqualTo(max)
    ) {
      isType = true;
    } else {
      isType = false;
    }
  } else {
    isType = false;
  }
  return [isType, num, min.toString(), max.toString()];
}

export function checkUint(value, type) {
  const num = Number(type.substr(4));
  const min = new BigNumber(0);
  const max = new BigNumber(Math.pow(2, num)).minus(1);
  let isType = false;
  if (!isNaN(value)) {
    const valNum = new BigNumber(value);
    if (
      valNum.isInteger() &&
      valNum.isGreaterThanOrEqualTo(min) &&
      valNum.isLessThanOrEqualTo(max)
    ) {
      isType = true;
    } else {
      isType = false;
    }
  } else {
    isType = false;
  }
  return [isType, num, min.toFixed(), max.toFixed()];
}

export function isHex(num, withPrefix = true) {
  const reg = withPrefix ? /^0x[0-9a-f]*$/i : /^(0x)?[0-9a-f]*$/i;
  return Boolean(num.match(reg));
}

export function isEvenLength(str) {
  const length = str.length;
  return length > 0 && length % 2 === 0;
}

export function checkBytes(value, type) {
  if (type === 'byte') {
    type = 'bytes1';
  }
  const num = Number(type.substr(5));
  let isBytes = false;
  if (!value) return [isBytes, num];
  if (isHex(value) && isEvenLength(value)) {
    if (num > 0) {
      const str = value.substr(2);
      const buffer = Buffer.from(str, 'hex');
      if (buffer.length === num) {
        isBytes = true;
      } else {
        isBytes = false;
      }
    } else {
      isBytes = true;
    }
  } else {
    isBytes = false;
  }
  return [isBytes, num];
}

export function checkCfxType(value) {
  if (isNaN(value)) {
    return false;
  }
  const valNum = new BigNumber(value);
  if (valNum.isNegative()) {
    return false;
  }
  let index = value.indexOf('.');
  if (index !== -1) {
    if (value.substr(index + 1).length > 18) {
      return false;
    } else {
      return true;
    }
  } else {
    return true;
  }
}

export const sleep = timeout =>
  new Promise(resolve => setTimeout(resolve, timeout));

// get two block interval time
export const getTimeByBlockInterval = (minuend = 0, subtrahend = 0) => {
  const seconds = new BigNumber(minuend)
    .minus(subtrahend)
    .dividedBy(2)
    .toNumber();
  const dayBase = 86400;
  const hourBase = 3600;
  const days = Math.floor(seconds / dayBase);
  const deltaSecond = seconds - days * 86400;
  const hours = Math.floor(deltaSecond / hourBase);
  return { days, hours, seconds };
};

export const addDays = (date, days) => {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

/**
 *
 * @param {number|string} data
 * @returns {boolean}
 * @example
 * 0    -> true
 * .    -> true
 * 0.   -> true
 * .0   -> true
 * 0.0  -> true
 * 0..0 -> false
 * x    -> false
 * e    -> false
 * @todo support config, such as negative and exponential notation
 */

/**
 *
 * @param {number|string} data
 * @returns {boolean}
 * @example
 * 0    -> true
 * .    -> false
 * 11   -> true
 * 011  -> false
 * -1   -> false
 */
export const isSafeNumberOrNumericStringInput = data =>
  /^\d+\.?\d*$|^\.\d*$/.test(data);

export const isZeroOrPositiveInteger = data => /^(0|[1-9]\d*)$/.test(data);

export const parseString = v => {
  if (typeof v === 'string' && !v.startsWith('0x')) {
    return Buffer.from(v);
  }
  return v;
};

// process datepicker initial value
export const getInitialDate = (minTimestamp, maxTimestamp) => {
  const startDate = dayjs('2020-10-29T00:00:00+08:00');
  const endDate = dayjs();
  const innerMinTimestamp = minTimestamp
    ? dayjs(new Date(parseInt((minTimestamp + '000') as string)))
    : startDate;
  const innerMaxTimestamp = maxTimestamp
    ? dayjs(new Date(parseInt((maxTimestamp + '000') as string)))
    : endDate;
  const disabledDateD1 = date =>
    date &&
    (date > innerMaxTimestamp.endOf('day') ||
      date < startDate.subtract(1, 'day').endOf('day'));
  const disabledDateD2 = date =>
    date &&
    (date < innerMinTimestamp.subtract(1, 'day').endOf('day') ||
      date > endDate.endOf('day'));

  return {
    minT: innerMinTimestamp,
    maxT: innerMaxTimestamp,
    dMinT: disabledDateD1,
    dMaxT: disabledDateD2,
  };
};

export const getNetwork = (networks: Array<NetworksType>, id: number) => {
  let matchs = networks.filter(n => n.id === id);
  let network: NetworksType;

  if (matchs) {
    network = matchs[0];
  } else {
    network = networks[0];
  }

  return network;
};

const urls = {
  stage: {
    1: '//testnet-stage.confluxscan.net',
    1029: '//www-stage.confluxscan.net',
    71: '//evmtestnet-stage.confluxscan.net',
    1030: '//evm-stage.confluxscan.net',
  },
  online: {
    1: '//testnet.confluxscan',
    1029: '//confluxscan',
    71: '//evmtestnet.confluxscan',
    1030: '//evm.confluxscan',
  },
};

export const getUrl = (_networkId?: string | number): string => {
  const networkId =
    _networkId || (NETWORK_TYPE === NETWORK_TYPES.mainnet ? '1029' : '1');
  let url = urls.stage[networkId];

  if (!IS_PRE_RELEASE) {
    url = `${urls.online[networkId]}${
      window.location.hostname.includes('.io') ? '.io' : '.net'
    }`;
  }
  return url;
};

export const gotoNetwork = (networkId: string | number): void => {
  const url = getUrl(networkId);
  window.location.assign(url);
};

export const getAddressInputPlaceholder = () => {
  if (NETWORK_TYPE === NETWORK_TYPES.mainnet) {
    return 'cfx:...';
  } else if (NETWORK_TYPE === NETWORK_TYPES.testnet) {
    return 'cfxtest:...';
  } else {
    return '';
  }
};

export function padLeft(n: string, totalLength?: number): string;
export function padLeft(n: number, totalLength?: number): string;
export function padLeft(n, totalLength = 1) {
  const num = parseInt(n);
  if (window.isNaN(num)) {
    return String(n);
  } else {
    let result = String(num);
    while (result.length < totalLength) {
      result = '0' + result;
    }
    return result;
  }
}

interface ErrorInfoType {
  url?: string;
  code?: number;
  message?: string;
  data?: string;
  method?: string;
}

export const publishRequestError = (
  e: (Error & ErrorInfoType) | ErrorInfoType,
  type: 'rpc' | 'http' | 'wallet' | 'code',
) => {
  let detail = '';

  if (e.code && e.message) {
    if (type === 'code') {
      detail = e.message;
    } else {
      detail = `Error Code: ${e.code} \n`;
      if (type === 'http') {
        const origin = window.location.origin;
        detail += `Rest Api Url: ${
          e.url?.includes('https://') ? e.url : origin + e.url
        } \n`;
      }
      if (type === 'rpc') {
        detail += `RPC Url: ${RPC_SERVER} \n`;
        if (!lodash.isNil(e.method)) {
          detail += `Method: ${e.method} \n`;
        }
        if (!lodash.isNil(e.data)) {
          detail += `Data: ${e.data} \n`;
        }
      }
      detail += `Error Message: ${e.message} \n`;
    }
  }

  pubsub.publish('notify', {
    type: 'request',
    option: {
      code: type === 'rpc' ? 30001 : e.code || 20000, // code is used for title, 20000 means unknown issue
      message: e.message,
      detail: detail,
    },
  });
};

export const addIPFSGateway = (
  imgURL: string,
  IPFSGatewayURL: string,
): string => {
  if (
    typeof imgURL === 'string' &&
    typeof IPFSGatewayURL === 'string' &&
    imgURL.startsWith('ipfs://')
  ) {
    imgURL = `${IPFSGatewayURL}/${imgURL.replace('ipfs://', 'ipfs/')}`;
  }

  return imgURL;
};

export const getChartsSubTitle = (title: string): string => {
  const suffix = window.location.host.substr(-4);
  if (suffix === '.net') {
    return title.replace('.io', '.net');
  } else {
    return title;
  }
};

interface ENSInfoType {
  [k: string]: ENSInfoItemType;
}
type ResponseENSInfo = Pick<ENSInfoItemType, 'name'>;
export const getENSInfo = (row: {
  from?: string;
  fromENSInfo?: ResponseENSInfo;
  to?: string;
  toENSInfo?: ResponseENSInfo;
  address?: string;
  ensInfo?: ResponseENSInfo;
  miner?: string;
  minerENSInfo?: ResponseENSInfo;
  base32address?: string;
}): ENSInfoType => {
  let result = {};

  try {
    if (row.from) {
      result[row.from] = {
        address: row.from,
        name: row.fromENSInfo?.name,
      };
    }

    if (row.to) {
      result[row.to] = {
        address: row.to,
        name: row.toENSInfo?.name,
      };
    }

    if (row.address) {
      result[row.address] = {
        address: row.address,
        name: row.ensInfo?.name,
      };
    }

    if (row.base32address) {
      result[row.base32address] = {
        address: row.base32address,
        name: row.ensInfo?.name,
      };
    }

    if (row.miner) {
      result[row.miner] = {
        address: row.miner,
        name: row.minerENSInfo?.name,
      };
    }
  } catch (e) {}

  return result;
};

export const getNametagInfo = (row: {
  from?: string;
  fromNameTagInfo?: Nametag;
  to?: string;
  toNameTagInfo?: Nametag;
  address?: string;
  nameTagInfo?: Nametag;
  miner?: string;
  minerNameTagInfo?: Nametag;
  base32address?: string;
}): {
  [k: string]: { address: string; nametag: string };
} => {
  let result = {};

  try {
    if (row.from) {
      result[row.from] = {
        address: row.from,
        nametag: row.fromNameTagInfo?.nameTag,
      };
    }

    if (row.to) {
      result[row.to] = {
        address: row.to,
        nametag: row.toNameTagInfo?.nameTag,
      };
    }

    if (row.address) {
      result[row.address] = {
        address: row.address,
        nametag: row.nameTagInfo?.nameTag,
      };
    }

    if (row.base32address) {
      result[row.base32address] = {
        address: row.base32address,
        nametag: row.nameTagInfo?.nameTag,
      };
    }

    if (row.miner) {
      result[row.miner] = {
        address: row.miner,
        nametag: row.minerNameTagInfo?.nameTag,
      };
    }
  } catch (e) {}

  return result;
};

const cSymbol = getCurrencySymbol();

export const formatPrice = (
  price: string | number,
  symbol: string = cSymbol,
): string[] => {
  const p = new BigNumber(price);
  let precision = 2;

  if (p.eq(0)) {
    return ['0', ''];
  } else if (p.lt(0.0001)) {
    return [
      '<0.0001',
      formatNumber(price || 0, {
        withUnit: false,
        precision: 18,
        keepZero: false,
      }),
    ];
  } else if (p.lt(1)) {
    precision = 4;
  } else if (p.lt(10)) {
    precision = 3;
  } else {
    precision = 2;
  }

  return [
    symbol +
      formatNumber(price || 0, {
        withUnit: false,
        keepZero: false,
        precision,
      }),
    '',
  ];
};

export const hideInDotNet = <T>(content: T): T | null => {
  if (HIDE_IN_DOT_NET) {
    return null;
  } else {
    return content;
  }
};

export const processSponsorStorage = (p = '0', c = '0') => {
  let point = '0';
  let collateral = '0';
  let total = '0';

  point = new BigNumber(p).div(1024).toString();
  collateral = c.toString();
  total = new BigNumber(point).plus(collateral).toString();

  return {
    point: p,
    collateral: c,
    fPoint: point,
    fCollateral: collateral,
    total,
  };
};

export const isLikeBigNumber = obj => {
  if (obj === null || typeof obj !== 'object') {
    return false;
  }
  return 's' in obj && 'e' in obj && 'c' in obj && Array.isArray(obj.c);
};

type NestedArray = (string | number | BigNumber | NestedArray)[];
type NestedObject = {
  [key: string]: BigNumber | string | NestedObject | NestedObject[];
};
export const convertBigNumbersToStrings = (input: NestedArray) => {
  return input.map(item => {
    if (item instanceof Uint8Array) {
      return item;
    }
    if (Array.isArray(item)) {
      return convertBigNumbersToStrings(item);
    } else if (
      item !== null &&
      typeof item === 'object' &&
      !isLikeBigNumber(item)
    ) {
      return convertObjBigNumbersToStrings(item);
    } else if (isLikeBigNumber(item)) {
      return item.toString(10);
    } else {
      return item;
    }
  });
};
export const convertObjBigNumbersToStrings = input => {
  const newObj: NestedObject = {};
  if (Array.isArray(input)) {
    return convertBigNumbersToStrings(input);
  }
  for (let key in input) {
    if (isLikeBigNumber(input[key])) {
      newObj[key] = input[key].toString(10);
    } else if (Array.isArray(input[key])) {
      newObj[key] = convertBigNumbersToStrings(input[key]);
    } else if (typeof input[key] === 'object') {
      newObj[key] = convertObjBigNumbersToStrings(input[key] as NestedObject);
    } else {
      newObj[key] = input[key];
    }
  }
  return newObj;
};
export const constprocessResultArray = resultArray => {
  if (typeof resultArray === 'string') {
    return resultArray;
  }
  const processElement = element => {
    if (Array.isArray(element)) {
      return element.map(processElement);
    } else if (element.type && element.type === 'Buffer') {
      let result = element.data
        .map(byte => ('00' + byte.toString(16)).slice(-2))
        .join('');
      if (!result.startsWith('0x')) {
        result = '0x' + result;
      }
      return result;
    } else {
      return element;
    }
  };

  const inputArray = Array.isArray(resultArray) ? resultArray : [resultArray];
  return inputArray.map(processElement);
};
