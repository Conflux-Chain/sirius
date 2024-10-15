import * as CORESPACE_MAINNET_CONFIG from './core/mainnet';
import * as CORESPACE_TESTNET_CONFIG from './core/testnet';
import * as CORESPACE_DEVNET_CONFIG from './core/devnet';
import {
  IS_CORESPACE_MAINNET,
  IS_CORESPACE_TESTNET,
  IS_CORESPACE_DEVNET,
} from './env-constants';

const DEFAULT_NETWORK_CONFIG = CORESPACE_MAINNET_CONFIG;

const _ENV_CONFIG = (() => {
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
export default ENV_CONFIG;
