import { LOCALSTORAGE_KEYS_MAP } from 'utils/enum';

export const IS_FOREIGN_HOST = /.io$/.test(window.location.host);
export const DOMAIN = IS_FOREIGN_HOST ? '.io' : '.net';

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
