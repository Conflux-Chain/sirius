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
 * @param { number } number 数字或字符串
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
};

/**
 * 获取给定时间戳 from 到给定时间 to 的 duration
 * @param {string | number} from syncTimestamp
 * @param {string | number} to current serverTimestamp or current browserTimestamp
 */
export const getDuration = (from: number, pTo?: number) => {
  const to = pTo || +new Date();

  if (from > to) {
    console.log('invalid timestamp pair');
    return [0, 0, 0, 0];
  }

  const fullDay = dayjs(to).diff(from, 'day');
  const fullHour = dayjs(to).diff(from, 'hour');
  const fullMinute = dayjs(to).diff(from, 'minute');

  const day = dayjs(to).diff(from, 'day');
  const hour = dayjs(to).subtract(fullDay, 'day').diff(from, 'hour');
  const minute = dayjs(to).subtract(fullHour, 'hour').diff(from, 'minute');
  const second = dayjs(to).subtract(fullMinute, 'minute').diff(from, 'second');

  return [day, hour, minute, second];
};
