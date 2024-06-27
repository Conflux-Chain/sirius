import BigNumber from 'bignumber.js';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { NetworksType } from '@cfxjs/sirius-next-common/dist/store/types';
import {
  NETWORK_ID,
  getCurrencySymbol,
  HIDE_IN_DOT_NET,
  CORE_SPACE_CHAIN_IDS,
  ESPACE_CHAIN_IDS,
  BSPACE_CHAIN_IDS,
} from 'utils/constants';
import pubsub from './pubsub';
import lodash from 'lodash';
import { Nametag } from 'utils/hooks/useNametag';
import ENV_CONFIG, { NETWORK_TYPES } from 'env';
import IconCore from 'images/core-space/icon.svg';
import IconEvm from 'images/espace/icon.svg';
import IconBtc from 'images/bspace/icon.svg';

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
  getIncreasePercent,
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

// Is input match epoch number format
// 0x??? need to convert to decimal int
export function isEpochNumber(str: string) {
  var n = Math.floor(Number(str));
  return n !== Infinity && String(n) === str && n >= 0;
}

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

export const gotoNetwork = (url: string): void => {
  url && window.location.assign(url);
};

export const getNetworkIcon = (
  id = NaN,
  props?: {
    isCore?: boolean;
    isEvm?: boolean;
    isBtc?: boolean;
  },
) => {
  const isCore = CORE_SPACE_CHAIN_IDS.includes(id) || props?.isCore;
  const isEvm = ESPACE_CHAIN_IDS.includes(id) || props?.isEvm;
  const isBtc = BSPACE_CHAIN_IDS.includes(id) || props?.isBtc;
  if (isCore) {
    return IconCore;
  } else if (isEvm) {
    return IconEvm;
  } else if (isBtc) {
    return IconBtc;
  }
};

export const getAddressInputPlaceholder = () => {
  if (ENV_CONFIG.ENV_NETWORK_TYPE === NETWORK_TYPES.CORE_MAINNET) {
    return 'cfx:...';
  } else if (ENV_CONFIG.ENV_NETWORK_TYPE === NETWORK_TYPES.CORE_TESTNET) {
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
        detail += `RPC Url: ${ENV_CONFIG.ENV_RPC_SERVER} \n`;
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

export const getChartsSubTitle = (title: string): string => {
  const suffix = window.location.host.substr(-4);
  if (suffix === '.net') {
    return title.replace('.io', '.net');
  } else {
    return title;
  }
};
export interface ENSInfoItemType {
  address: string;
  name: string;
  expired?: number;
}
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

export const getCoreGasTargetUsage = (
  gasUsed: Parameters<typeof getIncreasePercent>[0],
) => getIncreasePercent(gasUsed, 27000000);
