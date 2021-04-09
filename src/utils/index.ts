import {
  addressTypeCommon,
  addressTypeContract,
  addressTypeInternalContract,
  adminControlAddress,
  sponsorWhitelistControlAddress,
  stakingAddress,
  zeroAddress,
} from './constants';
import BigNumber from 'bignumber.js';
import numeral from 'numeral';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import fetch from './request';
import { Buffer } from 'buffer';
import { cfxAddress, formatAddress } from './cfx';

dayjs.extend(relativeTime);

export const innerContract = [
  formatAddress('0x0888000000000000000000000000000000000000'),
  formatAddress('0x0888000000000000000000000000000000000001'),
  formatAddress('0x0888000000000000000000000000000000000002'),
];

export const delay = (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const getAddressType = address => {
  try {
    const type = cfxAddress.decodeCfxAddress(
      formatAddress(address, { hex: false }),
    ).type;
    switch (type) {
      case 'user':
        return addressTypeCommon;
      case 'contract':
        return addressTypeContract;
      case 'builtin':
        return addressTypeInternalContract;
      default:
        return null;
    }
  } catch (e) {
    return null;
  }
};

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

const riskDivided = new BigNumber(2).pow(256).minus(1);
const eps = new BigNumber(1e-6);

export function transferRisk(riskStr) {
  const riskNum = new BigNumber(riskStr, 16).dividedBy(riskDivided);
  if (riskNum.isNaN()) {
    return '';
  }
  // if risk > 1e-4*(1+eps) =>
  if (riskNum.isGreaterThan(new BigNumber(1e-4).times(eps.plus(1)))) {
    return 'lv3';
  }
  // risk > 1e-6*(1+eps)
  if (riskNum.isGreaterThan(new BigNumber(1e-6).times(eps.plus(1)))) {
    return 'lv2';
  }
  // risk > 1e-8*(1+eps)
  if (riskNum.isGreaterThan(new BigNumber(1e-8).times(eps.plus(1)))) {
    return 'lv1';
  }

  return 'lv0';
}

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

/**
 * 格式化数字
 * @param { number | string } number 数字或字符串
 * @return { string } 数字 n 的整数部分超过3位后，使用 k、M、G… 增加依次，小数部分最多支持 3 位，四舍五入，末位为 0 时省略
 */
export const formatNumber_bak = (num: number | string) => {
  if (num === 0 || num === '0') return '0';
  if (new BigNumber(num).lt(0.001)) return '< 0.001';
  return numeral(num)
    .format('0,0a.[000]', Math.floor)
    .toUpperCase()
    .replace('B', 'G');
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
  type?: 'tag' | 'hash' | 'address' | 'tokenTracker' | number,
) => {
  let result: string;
  switch (type) {
    case 'tag':
      result = getEllipsStr(str, 14, 0);
      break;
    case 'hash':
      result = getEllipsStr(str, 8, 0);
      break;
    case 'address':
      result = getEllipsStr(str, 6, 4);
      break;
    case 'tokenTracker':
      result = getEllipsStr(str, 24, 0);
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

    const fullDay = dayjs(to).diff(from, 'day');
    const fullHour = dayjs(to).diff(from, 'hour');
    const fullMinute = dayjs(to).diff(from, 'minute');

    const day = dayjs(to).diff(from, 'day');
    const hour = dayjs(to).subtract(fullDay, 'day').diff(from, 'hour');
    const minute = dayjs(to).subtract(fullHour, 'hour').diff(from, 'minute');
    const second = dayjs(to)
      .subtract(fullMinute, 'minute')
      .diff(from, 'second');

    return [day, hour, minute, second];
  } catch (e) {
    return [0, 0, 0, 0];
  }
};

export const convertToValueorFee = bigNumber => {
  const result = new BigNumber(bigNumber).dividedBy(10 ** 18);
  if (result.toNumber() === 0) return '0';
  if (result.toNumber() < 0.001) return `< 0.001`;
  return `${result.toString(10)}`;
};

/**
 *
 * @param num original number
 * @param isShowFull Whether to show all numbers
 */
export const fromDripToCfx = (
  num: number | string,
  isShowFull: boolean = false,
  opt = {},
) => {
  const bn = new BigNumber(num);
  let result: string = '0';
  if (!window.isNaN(bn.toNumber()) && bn.toNumber() !== 0) {
    const divideBn = bn.dividedBy(10 ** 18);
    if (isShowFull) {
      result = toThousands(divideBn.toFixed());
    } else {
      result =
        divideBn.toNumber() < 0.001
          ? '< 0.001'
          : formatNumber(divideBn.toNumber(), opt);
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
  opt = {},
) => {
  const bn = new BigNumber(num);
  let result: string = '0';
  if (!window.isNaN(bn.toNumber()) && bn.toNumber() !== 0) {
    const divideBn = bn.dividedBy(10 ** 9);
    if (isShowFull) {
      result = toThousands(divideBn.toFixed());
    } else {
      result =
        divideBn.toNumber() < 0.001
          ? '< 0.001'
          : formatNumber(divideBn.toNumber(), opt);
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
) => {
  if (Number(dividend) === 0) return 0 + '%';
  const bnDivisor = new BigNumber(divisor);
  const bnDividend = new BigNumber(dividend);
  return `${formatNumber(
    bnDivisor.dividedBy(bnDividend).multipliedBy(100).toNumber(),
  )}%`;
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
) => {
  try {
    if (isShowFull) {
      return toThousands(
        new BigNumber(balance).div(new BigNumber(10).pow(decimals)).toFixed(),
      );
    }
    return formatNumber(
      new BigNumber(balance).div(new BigNumber(10).pow(decimals)).toString(),
      opt,
    );
  } catch {}
};

export const getUnitByCfxNum = (
  num: number | string,
  isShowFull: boolean = false,
) => {
  const bn = new BigNumber(num);
  let numFormatted: number | string = '';
  let unit = '';
  if (bn.toNumber() < 10 ** 9) {
    if (isShowFull) {
      numFormatted = toThousands(bn.toNumber());
    } else {
      numFormatted = formatNumber(bn.toNumber());
    }
    unit = 'drip';
  } else if (10 ** 9 <= bn.toNumber() && bn.toNumber() < 10 ** 18) {
    numFormatted = fromDripToGdrip(bn.toNumber(), isShowFull);
    unit = 'Gdrip';
  } else {
    numFormatted = fromDripToCfx(bn.toNumber(), isShowFull);
    unit = 'CFX';
  }
  return { num: numFormatted, unit };
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

export const isAddress = (str: string) => {
  return formatAddress(str) !== '';
  // return cfxAddress.isValidCfxAddress(str); // only support new address
  // return /^0x[0-9a-fA-F]{40}$/.test(str);
};

export function isZeroAddress(str: string) {
  return formatAddress(str) === zeroAddress;
}

export function isAccountAddress(str: string) {
  return getAddressType(str) === addressTypeCommon || isZeroAddress(str);
}

export function isContractAddress(str: string) {
  return getAddressType(str) === addressTypeContract;
}

export function isInnerContractAddress(str: string) {
  return (
    getAddressType(str) === addressTypeInternalContract &&
    [
      adminControlAddress,
      sponsorWhitelistControlAddress,
      stakingAddress,
    ].includes(formatAddress(str, { hex: false }))
  );
}

// address start with 0x0, not valid internal contract, but fullnode support
export function isSpecialAddress(str: string) {
  return (
    getAddressType(str) === addressTypeInternalContract &&
    ![
      adminControlAddress,
      sponsorWhitelistControlAddress,
      stakingAddress,
    ].includes(formatAddress(str, { hex: false }))
  );
}

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
export function isBetween(x: number, min: number, max: number) {
  return x >= min && x <= max;
}
export function checkInt(value, type) {
  const num = Number(type.substr(3));
  const min = new BigNumber(-Math.pow(2, num - 1));
  const max = new BigNumber(Math.pow(2, num - 1)).minus(1);
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
export function isHex(num) {
  return Boolean(num.match(/^0x[0-9a-f]+$/i));
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

export const getRandomString = () => {
  return Math.random().toString(32).substr(2);
};

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
