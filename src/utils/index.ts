import { addressTypeContract, addressTypeCommon } from './constants';
import BigNumber from 'bignumber.js';
import numeral from 'numeral';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Big } from '@cfxjs/react-hooks';
dayjs.extend(relativeTime);

export const delay = (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const getAddressType = address => {
  return address && address.startsWith('0x8')
    ? addressTypeContract
    : addressTypeCommon;
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

export const toThousands = num => {
  if ((typeof num !== 'number' || isNaN(num)) && typeof num !== 'string')
    return '';
  let str = num + '';
  return str.split('.').reduce((acc, cur, index) => {
    if (index) {
      return `${acc}.${cur}`;
    } else {
      return cur.replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, '$1,');
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
export const formatNumber = (num: number | string) => {
  if (num === 0 || num === '0') return '0';
  if (new BigNumber(num).lt(0.001)) return '< 0.001';
  return numeral(num)
    .format('0,0a.[000]', Math.floor)
    .toUpperCase()
    .replace('B', 'G');
};

/**
 * 格式化字符串
 * @param {string} str
 * @param {string} type 可能取值为：tag - contract name tag, hash, address; 如果 type 为数字，则截取对应数字 + ...，默认值为 12
 */
export const formatString = (
  str: string,
  type?: 'tag' | 'hash' | 'address' | number,
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
          : formatNumber(divideBn.toNumber());
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
          : formatNumber(divideBn.toNumber());
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

export const formatBalance = (balance, decimals = 18, isShowFull = false) => {
  try {
    if (isShowFull) {
      return toThousands(Big(balance).div(Big(10).pow(decimals)).toFixed());
    }
    return formatNumber(Big(balance).div(Big(10).pow(decimals)).toString());
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
  return /^0x[0-9a-fA-F]{40}$/.test(str);
};

export function isAccountAddress(str: string) {
  return /^0x1[0-9a-fA-F]{39}$/.test(str);
}

export function isContractAddress(str: string) {
  return /^0x8[0-9a-fA-F]{39}$/.test(str);
}

export function isInnerContractAddress(str: string) {
  return /^0x0[0-9a-fA-F]{39}$/.test(str);
}

export const isHash = (str: string) => {
  return /^0x[0-9a-fA-F]{64}$/.test(str);
};

export const isBlockHash = async (str: string) => {
  if (!isHash(str)) return false;
  let isBlock = true;
  try {
    const block = await fetch(`/v1/block/${str}`).then(res => res.json());
    if (block.code !== undefined) isBlock = false;
  } catch (err) {
    isBlock = false;
  }

  return isBlock;
};

export const isTxHash = async (str: string) => {
  if (!isHash(str)) return false;
  return !isBlockHash(str);
};

export function isEpochNumber(str: string) {
  var n = Math.floor(Number(str));
  return n !== Infinity && String(n) === str && n >= 0;
}
