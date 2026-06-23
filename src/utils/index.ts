import BigNumber from 'bignumber.js';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { NETWORK_ID, HIDE_IN_DOT_NET } from 'utils/constants';
import { IS_CORESPACE, IS_MAINNET, IS_TESTNET } from 'env';

import {
  getEllipsStr,
  toThousands,
  formatNumber,
  getPercent,
  roundToFixedPrecision,
  formatTimeStamp,
  fromGdripToDrip,
  fromCfxToDrip,
  formatBalance,
  isHash,
  isBlockHash,
  isTxHash,
  validURL,
  byteToKb,
  isObject,
  checkInt,
  checkUint,
  isHex,
  checkBytes,
  checkCfxType,
  sleep,
  getTimeByBlockInterval,
  isSafeNumberOrNumericStringInput,
  isZeroOrPositiveInteger,
  parseString,
  getInitialDate,
  addIPFSGateway,
  convertBigNumbersToStrings,
  convertObjBigNumbersToStrings,
  constprocessResultArray,
  formatLargeNumber,
} from '@cfxjs/sirius-next-common/dist/utils';

import {
  getCoreAddressInfo,
  isCoreAddress as isAddress,
  isZeroAddress,
  isCoreContractAddress,
  isInnerContractAddress,
  isSpecialAddress,
  formatAddress as _formatAddress,
  isBase32Address,
  isSimplyBase32Address,
} from '@cfxjs/sirius-next-common/dist/utils/address';

export {
  formatNumber,
  toThousands,
  getPercent,
  roundToFixedPrecision,
  formatTimeStamp,
  fromGdripToDrip,
  fromCfxToDrip,
  formatBalance,
  isHash,
  isBlockHash,
  isTxHash,
  validURL,
  byteToKb,
  isObject,
  checkInt,
  checkUint,
  isHex,
  checkBytes,
  checkCfxType,
  sleep,
  getTimeByBlockInterval,
  isSafeNumberOrNumericStringInput,
  isZeroOrPositiveInteger,
  parseString,
  getInitialDate,
  addIPFSGateway,
  convertBigNumbersToStrings,
  convertObjBigNumbersToStrings,
  constprocessResultArray,
  formatLargeNumber,
};

export {
  isBase32Address,
  getCoreAddressInfo,
  isSimplyBase32Address,
  isAddress,
  isZeroAddress,
  isCoreContractAddress,
  isInnerContractAddress,
  isSpecialAddress,
};

dayjs.extend(relativeTime);

export const formatAddress = (
  address: string,
  outputType: 'hex' | 'base32' = 'base32',
) => {
  return _formatAddress(address, outputType);
};

// Todo: Distinguish between core and evm
export function isAccountAddress(address: string): boolean {
  return getCoreAddressInfo(address)?.type === 'user' || isZeroAddress(address);
}

export function isCurrentNetworkAddress(address: string): boolean {
  return getCoreAddressInfo(address)?.netId === NETWORK_ID;
}

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

// Is input match epoch number format
// 0x??? need to convert to decimal int
export function isEpochNumber(str: string) {
  var n = Math.floor(Number(str));
  return n !== Infinity && String(n) === str && n >= 0;
}

export const getAddressInputPlaceholder = () => {
  if (IS_CORESPACE && IS_MAINNET) {
    return 'cfx:...';
  } else if (IS_CORESPACE && IS_TESTNET) {
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

export const getCoreGasTargetUsedPercent = (_gasUsed: string | number) => {
  const gasUsed = new BigNumber(_gasUsed);
  const value = Number(
    gasUsed.dividedBy(27000000).multipliedBy(100).toFixed(0),
  );
  return {
    value,
    percent: getPercent(_gasUsed, 27000000, 0),
  };
};
