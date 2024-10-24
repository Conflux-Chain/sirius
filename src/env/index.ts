import * as CORESPACE_MAINNET_CONFIG from './core/mainnet';
import * as CORESPACE_TESTNET_CONFIG from './core/testnet';
import * as CORESPACE_DEVNET_CONFIG from './core/devnet';
import { CHAIN_TYPES, NETWORK_TYPES } from './types';

const getConfigFromFile = () => {
  const cacheKey = 'STATIC_CONFIG_CACHE';
  try {
    const cache = localStorage.getItem(cacheKey);
    fetch('/config.json').then(response => {
      response.ok &&
        response.json().then(res => {
          const resString = JSON.stringify(res);
          if (resString !== cache) {
            localStorage.setItem(cacheKey, resString);
            window.location.reload();
          }
        });
    });
    return JSON.parse(cache ?? '') as typeof DEFAULT_NETWORK_CONFIG;
  } catch (error) {
    return ({} as unknown) as typeof DEFAULT_NETWORK_CONFIG;
  }
};

const DEFAULT_NETWORK_CONFIG = CORESPACE_MAINNET_CONFIG;

const _ENV_CONFIG = (() => {
  const IS_STATIC = process.env.REACT_APP_STATIC === 'true';
  if (IS_STATIC) {
    return getConfigFromFile();
  }
  const IS_CORESPACE_DEVNET =
    process.env.REACT_APP_CORE_DEVNET === 'true' ||
    /^net[\d]+cfx/.test(window.location.host);
  const IS_CORESPACE_TESTNET =
    process.env.REACT_APP_CORE_TESTNET === 'true' ||
    /^testnet[.-]/.test(window.location.hostname);
  const IS_CORESPACE_MAINNET =
    process.env.REACT_APP_CORE_MAINNET === 'true' ||
    /^((www[.-])|(confluxscan[.]))/.test(window.location.hostname);
  if (IS_CORESPACE_MAINNET) {
    return CORESPACE_MAINNET_CONFIG;
  } else if (IS_CORESPACE_TESTNET) {
    return CORESPACE_TESTNET_CONFIG;
  } else if (IS_CORESPACE_DEVNET) {
    return CORESPACE_DEVNET_CONFIG;
  }
  console.warn('Unknown env');
  return DEFAULT_NETWORK_CONFIG;
})();
export * from './env-constants';
export * from './types';

/**
 * This makes it easy to replace strings directly in the script
 * @see `docker/setupEnv.js`
 */
const ENV_CONFIG = _ENV_CONFIG;

export const IS_CORESPACE = ENV_CONFIG.ENV_NETWORK_TYPE === NETWORK_TYPES.CORE;
export const IS_MAINNET = ENV_CONFIG.ENV_CHAIN_TYPE === CHAIN_TYPES.MAINNET;
export const IS_TESTNET = ENV_CONFIG.ENV_CHAIN_TYPE === CHAIN_TYPES.TESTNET;
export const IS_DEVNET = ENV_CONFIG.ENV_CHAIN_TYPE === CHAIN_TYPES.DEVNET;

export default ENV_CONFIG;
