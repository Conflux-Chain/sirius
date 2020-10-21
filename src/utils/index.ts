import { addressTypeContract, addressTypeCommon } from './constants';

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
