import { API_HOST_MAP, DOMAIN, IS_STAGE } from 'env/env-constants';
import { NETWORK_TYPES, CHAIN_TYPES } from 'env/types';
import logo from 'images/core-space/logo-testnet.svg';

export const ENV_NETWORK_ID = 1;
export const ENV_NETWORK_TYPE = NETWORK_TYPES.CORE;
export const ENV_CHAIN_TYPE = CHAIN_TYPES.TESTNET;
export const ENV_OPEN_API_HOST =
  API_HOST_MAP.openAPIHost ||
  (IS_STAGE
    ? `https://api-testnet-stage.confluxscan${DOMAIN}`
    : `https://api-testnet.confluxscan${DOMAIN}`);
export const ENV_RPC_SERVER =
  API_HOST_MAP.rpcHost || 'https://test.confluxrpc.com';
export const ENV_FC_ADDRESS =
  'cfxtest:achteu1f777f1j1s8s4tvsx5vk5vcbrn4ykxa0fzg1';
export const ENV_FC_EXCHANGE_ADDRESS =
  'cfxtest:acf6wwargxpp9ddfe7rnagf2ty9gsxs54uptst589y';
export const ENV_FC_EXCHANGE_INTEREST_ADDRESS =
  'cfxtest:acadrvdd07u69hazg0nkjkpdetvyc5wma6put8949d';
export const ENV_ENS_REGISTRY_ADDRESS =
  'cfxtest:acemru7fu1u8brtyn3hrtae17kbcd4pd9u2m761bta';
export const ENV_ENS_PUBLIC_RESOLVER_ADDRESS =
  'cfxtest:acbfyf69zaxau5a23w10dgyrmb0hrz4p9pewn6sejp';
export const ENV_LOGO = logo;
