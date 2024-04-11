import { LOCALSTORAGE_KEYS_MAP } from 'utils/enum';

export const IS_FOREIGN_HOST = /.io$/.test(window.location.host);
export const DOMAIN = IS_FOREIGN_HOST ? '.io' : '.net';

export const IS_CORESPACE_DEVNET =
  process.env.REACT_APP_CORE_DEVNET === 'true' ||
  /^net[\d]+cfx/.test(window.location.host);
export const IS_CORESPACE_TESTNET =
  process.env.REACT_APP_CORE_TESTNET === 'true' ||
  /^testnet[.-]/.test(window.location.hostname);
export const IS_CORESPACE_MAINNET =
  process.env.REACT_APP_CORE_MAINNET === 'true' ||
  /^(www[.-])|(confluxscan[.])/.test(window.location.hostname);

export const IS_CORESPACE =
  IS_CORESPACE_MAINNET || IS_CORESPACE_TESTNET || IS_CORESPACE_DEVNET;
export const IS_MAINNET = IS_CORESPACE_MAINNET;
export const IS_TESTNET = IS_CORESPACE_TESTNET;
export const IS_DEVNET = IS_CORESPACE_DEVNET;
// only for dev and qa, use with caution
export const IS_STAGE = process.env.REACT_APP_DEV === 'true';
export const IS_DEV = process.env.NODE_ENV === 'development';

export const STAGE_FLAG = IS_STAGE ? '-stage' : '';

export const API_HOST_MAP: {
  rpcHost?: string;
  openAPIHost?: string;
} = (() => {
  try {
    const apis = localStorage.getItem(LOCALSTORAGE_KEYS_MAP.apis) ?? '';
    return JSON.parse(apis);
  } catch (error) {
    return {};
  }
})();
