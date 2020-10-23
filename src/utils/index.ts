import { addressTypeContract, addressTypeCommon } from './constants';
import BigNumber from 'bignumber.js';
import numeral from 'numeral';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export const isCfxAddress = (address: string) => {
  return /^0x[0-9a-f]{40}$/.test(address);
};

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

const riskDivided = new BigNumber(2).pow(256).minus(1);
const eps = new BigNumber(1e-6);
/**
 * convert number to thousands-string
 * @param {*} num
 */
export const toThousands = num => {
  let str = num + '';
  let re = /(?=(?!(\b))(\d{3})+$)/g;
  str = str.replace(re, ',');
  return str;
};

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

export const devidedByDecimals = (number, decimals) => {
  const bignumber =
    number instanceof BigNumber ? number : new BigNumber(number);
  const result = bignumber.dividedBy(10 ** decimals);
  return result.toString(10);
};

export const getEllipsStr = (str: string, frontNum: number, endNum: number) => {
  if (str) {
    const length = str.length;
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
 * @param { number | string } number 数字或字符串，字符串用来处理 big int
 * @return { string } 数字 n 的整数部分超过3位后，根据千分符使用 k、M、G… 增加依次，小数部分最多支持 3 位，四舍五入，末位为 0 时省略
 */
export const formatNumber = (num: number | string) => {
  // todo, need big number format
  return numeral(num).format('0,0a.[000]').toUpperCase().replace('K', 'k');
};

/**
 * 格式化字符串
 * @param {string} str
 * @param {string} type 可能取值为：tag - contract name tag, hash, address
 */
export const formatString = (
  str: string,
  type?: 'tag' | 'hash' | 'address',
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
      result = getEllipsStr(str, 12, 0);
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
 * @param isOmitting whether omiting the number when it is less than 0.01
 * @param isShowFull Whether to show all numbers
 */
export const fromDripToCfx = (
  num: number | string,
  isOmitting = true,
  isShowFull = false,
) => {
  if (!num) return 0;
  const bn = new BigNumber(num).dividedBy(10 ** 18);
  if (isShowFull) {
    return bn.toNumber() + ' CFX';
  }
  if (isOmitting) {
    return bn.toNumber() < 0.001
      ? '< 0.001 CFX'
      : formatNumber(bn.toNumber()) + ' CFX';
  } else {
    return formatNumber(bn.toNumber()) + ' CFX';
  }
};

/**
 *
 * @param num original number
 * @param isOmitting whether omiting the number when it is less than 0.01
 * @param isShowFull Whether to show all numbers
 */
export const fromDripToGdrip = (
  num: number | string,
  isOmitting = true,
  isShowFull = false,
) => {
  if (!num) return 0;
  const bn = new BigNumber(num).dividedBy(10 ** 9);
  if (isShowFull) {
    return bn.toNumber() + ' Gdrip';
  }
  if (isOmitting) {
    return bn.toNumber() < 0.001
      ? '< 0.001 Gdrip'
      : formatNumber(bn.toNumber()) + ' Gdrip';
  } else {
    return formatNumber(bn.toNumber()) + ' Gdrip';
  }
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
  return formatNumber(bnDivisor.dividedBy(bnDividend).toNumber()) + '%';
};
