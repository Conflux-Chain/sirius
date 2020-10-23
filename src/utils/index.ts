import { addressTypeContract, addressTypeCommon } from './constants';
import BigNumber from 'bignumber.js';

export const tranferToLowerCase = (str: string) => {
  return str ? str.toLowerCase() : '';
};
export const isCfxAddress = (address: string) => {
  return /^0x[0-9a-f]{40}$/.test(address);
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

export const delay = (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const getAddressType = address => {
  return address && address.startsWith('0x8')
    ? addressTypeContract
    : addressTypeCommon;
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
