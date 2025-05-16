import * as CORESPACE_MAINNET_CONFIG from './core/mainnet';
import * as CORESPACE_TESTNET_CONFIG from './core/testnet';
import * as CORESPACE_DEVNET_CONFIG from './core/devnet';
import { CHAIN_TYPES, NETWORK_TYPES } from './types';

const DEFAULT_NETWORK_CONFIG = CORESPACE_MAINNET_CONFIG;

const ENV_CONFIG = (() => {
  if (window.customConfig && typeof window.customConfig === 'object') {
    return window.customConfig as typeof DEFAULT_NETWORK_CONFIG;
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

export const IS_CORESPACE = ENV_CONFIG.ENV_NETWORK_TYPE === NETWORK_TYPES.CORE;
export const IS_MAINNET = ENV_CONFIG.ENV_CHAIN_TYPE === CHAIN_TYPES.MAINNET;
export const IS_TESTNET = ENV_CONFIG.ENV_CHAIN_TYPE === CHAIN_TYPES.TESTNET;
export const IS_DEVNET = ENV_CONFIG.ENV_CHAIN_TYPE === CHAIN_TYPES.DEVNET;

export default ENV_CONFIG;
