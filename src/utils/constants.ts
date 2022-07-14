import SDK from 'js-conflux-sdk/dist/js-conflux-sdk.umd.min.js';
import lodash from 'lodash';

interface ContractsType {
  faucet: string;
  faucetLast: string;
  announcement: string;
  wcfx: string;
  governance: string;
  adminControl: string;
  sponsorWhitelistControl: string;
  staking: string;
  context: string;
  posRegister: string;
  zero: string;
}

interface ContractNameTagType {
  [index: string]: string;
}

export const RPC_SERVER = window.location.origin + '/rpcv2'; // cip-37

// only for dev and qa, use with caution
export const IS_PRE_RELEASE =
  process.env.REACT_APP_TestNet === 'true' ||
  window.location.hostname.includes('stage');

export const IS_TESTNET =
  process.env.REACT_APP_TestNet === 'true' ||
  window.location.hostname.includes('testnet');

export enum DEFAULT_NETWORK_IDS {
  mainnet = 1029,
  testnet = 1,
}

/**
 * @todo
 * 1. setNFTCacheInfo cacheKey
 * 2. GlobalTip
 *
 * @export
 * @enum {number}
 */
export enum LOCALSTORAGE_KEYS_MAP {
  reqProjectConfigMD5 = 'CONFLUX_SCAN_REQ_PROJECT_CONFIG_MD5',
  networkId = 'CONFLUX_SCAN_NETWORK_ID',
  contracts = 'CONFLUX_SCAN_CONTRACTS',
  contractNameTag = 'CONFLUX_SCAN_CONTRACT_NAME_TAG',
  currency = 'CONFLUX_SCAN_LOCALSTORAGE_KEY_CURRENCY',
  ageFormat = 'CONFLUX_SCAN_TABLE_AGE_FORMAT',
  cookieAgreed = 'CONFLUXSCAN_COOKIE_AGREED',
  txnRecords = 'CONFLUXSCAN_TXN_RECORDS',
  fccfxNotice = 'CONFLUX_SCAN_FCCFX_NOTICE',
  addressLabel = 'CONFLUX_SCAN_ADDRESS_LABELS',
  txPrivateNote = 'CONFLUX_SCAN_TX_PRIVATE_NOTES',
}

export const NETWORK_ID = (() => {
  let networkId = IS_TESTNET
    ? DEFAULT_NETWORK_IDS.testnet
    : DEFAULT_NETWORK_IDS.mainnet;
  let cacheNetworkId = Number(
    localStorage.getItem(LOCALSTORAGE_KEYS_MAP.networkId),
  );

  if (lodash.isFinite(cacheNetworkId)) {
    networkId = Number(cacheNetworkId);
  }
  return networkId;
})();

// network type is come from backend network id, now there are three state, can be extended with special case
export enum NETWORK_TYPES {
  mainnet = 'MAINNET',
  testnet = 'TESTNET',
  privatenet = 'PRIVATENET',
}

export const NETWORK_TYPE = (() => {
  if (NETWORK_ID === 1) {
    return NETWORK_TYPES.testnet;
  } else if (NETWORK_ID === 1029) {
    return NETWORK_TYPES.mainnet;
  } else {
    return NETWORK_TYPES.privatenet;
  }
})();

export const CONTRACTS: ContractsType = (() => {
  // initial value used for ts check rule
  let contracts = {
    faucet: '',
    faucetLast: '',
    announcement: '',
    wcfx: '',
    governance: '',
    adminControl: '',
    sponsorWhitelistControl: '',
    staking: '',
    context: '',
    posRegister: '',
    zero: '',
  };

  try {
    const cachedContracts = JSON.parse(
      localStorage.getItem(LOCALSTORAGE_KEYS_MAP.contracts) as string,
    );
    if (Object.prototype.toString.call(contracts) === '[object Object]') {
      contracts = cachedContracts;
    }
  } catch (e) {}

  return contracts;
})();

export const CONTRACTS_NAME_LABEL: ContractNameTagType = (() => {
  let contractNameTag = {};
  try {
    const cachedContracts = JSON.parse(
      localStorage.getItem(LOCALSTORAGE_KEYS_MAP.contractNameTag) as string,
    );
    if (Object.prototype.toString.call(cachedContracts) === '[object Object]') {
      contractNameTag = cachedContracts;
    }
  } catch (e) {}

  return contractNameTag;
})();

export const CFX_TOKEN_TYPES = {
  erc20: 'ERC20',
  erc777: 'ERC777',
  erc721: 'ERC721',
  erc1155: 'ERC1155',
  crc20: 'CRC20',
  crc777: 'CRC777',
  crc721: 'CRC721',
  crc1155: 'CRC1155',
  cfx: 'CFX',
};

// same as connectWallet.notify.action in i18n file
export enum TXN_ACTION {
  default = 100,
  contractWrite = 101,
  contractEdit = 102,
  writeContract = 103,
  readContract = 104,
  sponsorApplication = 105,
  contractDeplpy = 106,
  swapWCFXToCFX = 107,
  swapCFXToWCFX = 108,
  fccfxWithdrawProfit = 109,
  fccfxStakeToEarnCFX = 110,
  fccfxSignToEarnAPY = 111,
  fccfxSignToSyncInterest = 112,
  fccfxWithdrawCFX = 113,
  tranferNFT = 114,
  tranferNFT1155 = 115,
}

export const CURRENCY_SYMBOLS = {
  USD: '$',
  CNY: '¥',
  GBP: '£',
  KRW: '₩',
  RUB: '₽',
  EUR: '€',
};

export const getCurrency = () => {
  return localStorage.getItem(LOCALSTORAGE_KEYS_MAP.currency) || 'USD';
};

export const getCurrencySymbol = () => {
  return CURRENCY_SYMBOLS[getCurrency()];
};

export const CFX = new SDK.Conflux({
  url: RPC_SERVER,
  networkId: NETWORK_ID,
});

export const ICON_DEFAULT_CONTRACT =
  'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMzNweCIgaGVpZ2h0PSIzM3B4IiB2aWV3Qm94PSIwIDAgMzMgMzMiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDYxLjIgKDg5NjUzKSAtIGh0dHBzOi8vc2tldGNoLmNvbSAtLT4KICAgIDx0aXRsZT5jb250cmFjdDwvdGl0bGU+CiAgICA8ZGVzYz5DcmVhdGVkIHdpdGggU2tldGNoLjwvZGVzYz4KICAgIDxnIGlkPSLpobXpnaItMSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgaWQ9IueUu+advyIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTY5NC4wMDAwMDAsIC0zMS4wMDAwMDApIj4KICAgICAgICAgICAgPGcgaWQ9ImNvbnRyYWN0IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg2ODIuMDAwMDAwLCAxOC4wMDAwMDApIj4KICAgICAgICAgICAgICAgIDxnIGlkPSJDb250cmFjdCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTIuMDAwMDAwLCAxMy4wMDAwMDApIj4KICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMTEuODYzOTQwOCwxMy4xNTYyNSBMMjguMzg2MDU5MiwxMy4xNTYyNSBDMjkuMjk0OTgyMSwxMy4xNTYyNSAyOS42MjQ1ODUxLDEzLjI1MDkwNzcgMjkuOTU2ODYxNSwxMy40Mjg1Nzc5IEMzMC4yODkxMzc5LDEzLjYwNjI5MzQgMzAuNTQ5OTU2NSwxMy44NjcxMTE5IDMwLjcyNzYyNjcsMTQuMTk5Mzg4MiBDMzAuOTA1MzQyMiwxNC41MzE2NjQ2IDMxLDE0Ljg2MTI2NzQgMzEsMTUuNzcwMTkwMSBMMzEsMjUuMDQyMzA5OSBDMzEsMjUuOTUxMjMyNiAzMC45MDUzNDIyLDI2LjI4MDgzNTQgMzAuNzI3NjcyLDI2LjYxMzExMTggQzMwLjU0OTk1NjUsMjYuOTQ1Mzg4MSAzMC4yODkxMzc5LDI3LjIwNjIwNjYgMjkuOTU2ODYxNSwyNy4zODM4NzY4IEMyOS42MjQ1ODUxLDI3LjU2MTU5MjMgMjkuMjk0OTgyMSwyNy42NTYyNSAyOC4zODYwNTkyLDI3LjY1NjI1IEwxMS44NjM5NDA4LDI3LjY1NjI1IEMxMC45NTUwMTc5LDI3LjY1NjI1IDEwLjYyNTQxNDksMjcuNTYxNTkyMyAxMC4yOTMxMzg1LDI3LjM4MzkyMjEgQzkuOTYwODYyMTMsMjcuMjA2MjA2NiA5LjcwMDA0MzUyLDI2Ljk0NTM4ODEgOS41MjIzNzMzLDI2LjYxMzExMTggQzkuMzQ0NjU3NzYsMjYuMjgwODM1NCA5LjI1LDI1Ljk1MTIzMjYgOS4yNSwyNS4wNDIzMDk5IEw5LjI1LDE1Ljc3MDE5MDEgQzkuMjUsMTQuODYxMjY3NCA5LjM0NDY1Nzc2LDE0LjUzMTY2NDYgOS41MjIzMjc5OCwxNC4xOTkzODgyIEM5LjcwMDA0MzUyLDEzLjg2NzExMTkgOS45NjA4NjIxMywxMy42MDYyOTM0IDEwLjI5MzEzODUsMTMuNDI4NjIzMiBDMTAuNjI1NDE0OSwxMy4yNTA5MDc3IDEwLjk1NTAxNzksMTMuMTU2MjUgMTEuODYzOTQwOCwxMy4xNTYyNSBaIiBpZD0i6Lev5b6EIiBmaWxsPSIjQzRDNkQyIiBmaWxsLXJ1bGU9Im5vbnplcm8iPjwvcGF0aD4KICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNOC4yMzg5NDA4Myw5LjUzMTI1IEwyNC43NjEwNTkyLDkuNTMxMjUgQzI1LjY2OTk4MjEsOS41MzEyNSAyNS45OTk1ODUxLDkuNjI1OTA3NzQgMjYuMzMxODYxNSw5LjgwMzU3NzkxIEMyNi42NjQxMzc5LDkuOTgxMjkzNCAyNi45MjQ5NTY1LDEwLjI0MjExMTkgMjcuMTAyNjI2NywxMC41NzQzODgyIEMyNy4yODAzNDIyLDEwLjkwNjY2NDYgMjcuMzc1LDExLjIzNjI2NzQgMjcuMzc1LDEyLjE0NTE5MDEgTDI3LjM3NSwyMS40MTczMDk5IEMyNy4zNzUsMjIuMzI2MjMyNiAyNy4yODAzNDIyLDIyLjY1NTgzNTQgMjcuMTAyNjcyLDIyLjk4ODExMTggQzI2LjkyNDk1NjUsMjMuMzIwMzg4MSAyNi42NjQxMzc5LDIzLjU4MTIwNjYgMjYuMzMxODYxNSwyMy43NTg4NzY4IEMyNS45OTk1ODUxLDIzLjkzNjU5MjMgMjUuNjY5OTgyMSwyNC4wMzEyNSAyNC43NjEwNTkyLDI0LjAzMTI1IEw4LjIzODk0MDgzLDI0LjAzMTI1IEM3LjMzMDAxNzg2LDI0LjAzMTI1IDcuMDAwNDE0OTEsMjMuOTM2NTkyMyA2LjY2ODEzODUyLDIzLjc1ODkyMjEgQzYuMzM1ODYyMTMsMjMuNTgxMjA2NiA2LjA3NTA0MzUyLDIzLjMyMDM4ODEgNS44OTczNzMzLDIyLjk4ODExMTggQzUuNzE5NjEyNDUsMjIuNjU1ODM1NCA1LjYyNSwyMi4zMjYyMzI2IDUuNjI1LDIxLjQxNzMwOTkgTDUuNjI1LDEyLjE0NTE5MDEgQzUuNjI1LDExLjIzNjI2NzQgNS43MTk2NTc3NiwxMC45MDY2NjQ2IDUuODk3MzI3OTgsMTAuNTc0Mzg4MiBDNi4wNzUwNDM1MiwxMC4yNDIxMTE5IDYuMzM1ODYyMTMsOS45ODEyOTM0IDYuNjY4MTM4NTIsOS44MDM2MjMyMiBDNy4wMDA0MTQ5MSw5LjYyNTkwNzc0IDcuMzMwMDE3ODYsOS41MzEyNSA4LjIzODk0MDgzLDkuNTMxMjUgTDguMjM4OTQwODMsOS41MzEyNSBaIiBpZD0i6Lev5b6EIiBmaWxsPSIjN0Y4Mjk2IiBmaWxsLXJ1bGU9Im5vbnplcm8iPjwvcGF0aD4KICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMjEuMTM2MDU5Miw1IEMyMi4wNDQ5ODIxLDUgMjIuMzc0NTg1MSw1LjA5NDY1Nzc0IDIyLjcwNjg2MTUsNS4yNzIzMjc5MSBDMjMuMDM5MTM3OSw1LjQ1MDA0MzQgMjMuMjk5OTU2NSw1LjcxMDg2MTk0IDIzLjQ3NzYyNjcsNi4wNDMxMzgyNSBDMjMuNjU1MzQyMiw2LjM3NTQxNDU1IDIzLjc1LDYuNzA1MDE3NDIgMjMuNzUsNy42MTM5NDAxNSBMMjMuNzUsMTYuODg2MDU5OSBDMjMuNzUsMTcuNzk0OTgyNiAyMy42NTUzNDIyLDE4LjEyNDU4NTQgMjMuNDc3NjcyLDE4LjQ1Njg2MTggQzIzLjI5OTk1NjUsMTguNzg5MTM4MSAyMy4wMzkxMzc5LDE5LjA0OTk1NjYgMjIuNzA2ODYxNSwxOS4yMjc2MjY4IEMyMi4zNzQ1ODUxLDE5LjQwNTM0MjMgMjIuMDQ0OTgyMSwxOS41IDIxLjEzNjA1OTIsMTkuNSBMNC42MTM5NDA4MywxOS41IEMzLjcwNTAxNzg2LDE5LjUgMy4zNzU0MTQ5MSwxOS40MDUzNDIzIDMuMDQzMTM4NTIsMTkuMjI3NjcyMSBDMi43MTA4NjIxMywxOS4wNDk5NTY2IDIuNDUwMDQzNTIsMTguNzg5MTM4MSAyLjI3MjM3MzMsMTguNDU2ODYxOCBDMi4wOTQ2MTI0NSwxOC4xMjQ1ODU0IDIsMTcuNzk0OTgyNiAyLDE2Ljg4NjA1OTkgTDIsNy42MTM5NDAxNSBDMiw2LjcwNTAxNzQyIDIuMDk0NjU3NzYsNi4zNzU0MTQ1NSAyLjI3MjMyNzk4LDYuMDQzMTM4MjUgQzIuNDUwMDQzNTIsNS43MTA4NjE5NCAyLjcxMDg2MjEzLDUuNDUwMDQzNCAzLjA0MzEzODUyLDUuMjcyMzczMjIgQzMuMzc1NDE0OTEsNS4wOTQ2MTI0MyAzLjcwNTAxNzg2LDUgNC42MTM5NDA4Myw1IEwyMS4xMzYwNTkyLDUgWiIgaWQ9Iui3r+W+hCIgZmlsbD0iIzRDNEY2MCIgZmlsbC1ydWxlPSJub256ZXJvIj48L3BhdGg+CiAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTguNjc2MDQxNyw4LjYyNSBMMTcuOTgwMjA4Myw4LjYyNSBMMTcuOTgwMjA4Myw4LjYyNSBDMTguMTYzNzI4LDguNjI1IDE4LjMxMjUsOC44Njg0NDUwMyAxOC4zMTI1LDkuMTY4NzUgQzE4LjMxMjUsOS40NjkwNTQ5NyAxOC4xNjM3MjgsOS43MTI1IDE3Ljk4MDIwODMsOS43MTI1IEw4LjY3NjA0MTY4LDkuNzEyNSBMOC42NzYwNDE2Nyw5LjcxMjUgQzguNDkyNTIxOTYsOS43MTI1IDguMzQzNzUsOS40NjkwNTQ5NyA4LjM0Mzc1LDkuMTY4NzUgQzguMzQzNzUsOC44Njg0NDUwMyA4LjQ5MjUyMTk2LDguNjI1IDguNjc2MDQxNjcsOC42MjUgTDguNjc2MDQxNyw4LjYyNSBaIE04LjY5MjMwNzcyLDExLjc5Njg3NSBMMTcuMDU3NjkyMywxMS43OTY4NzUgTDE3LjA1NzY5MjMsMTEuNzk2ODc1IEMxNy4yNTAxOTU1LDExLjc5Njg3NSAxNy40MDYyNSwxMi4wNDAzMiAxNy40MDYyNSwxMi4zNDA2MjUgQzE3LjQwNjI1LDEyLjY0MDkzIDE3LjI1MDE5NTUsMTIuODg0Mzc1IDE3LjA1NzY5MjMsMTIuODg0Mzc1IEw4LjY5MjMwNzcxLDEyLjg4NDM3NSBMOC42OTIzMDc2OSwxMi44ODQzNzUgQzguNDk5ODA0NTEsMTIuODg0Mzc1IDguMzQzNzUsMTIuNjQwOTMgOC4zNDM3NSwxMi4zNDA2MjUgQzguMzQzNzUsMTIuMDQwMzIgOC40OTk4MDQ1MSwxMS43OTY4NzUgOC42OTIzMDc2OSwxMS43OTY4NzUgTDguNjkyMzA3NzIsMTEuNzk2ODc1IFogTTguNzA2MjUwMDMsMTQuOTY4NzUgTDEzLjQxODc1LDE0Ljk2ODc1IEwxMy40MTg3NSwxNC45Njg3NSBDMTMuNjE4OTUzMywxNC45Njg3NSAxMy43ODEyNSwxNS4yMTIxOTUgMTMuNzgxMjUsMTUuNTEyNSBDMTMuNzgxMjUsMTUuODEyODA1IDEzLjYxODk1MzMsMTYuMDU2MjUgMTMuNDE4NzUsMTYuMDU2MjUgTDguNzA2MjUwMDEsMTYuMDU2MjUgTDguNzA2MjUsMTYuMDU2MjUgQzguNTA2MDQ2NjksMTYuMDU2MjUgOC4zNDM3NSwxNS44MTI4MDUgOC4zNDM3NSwxNS41MTI1IEM4LjM0Mzc1LDE1LjIxMjE5NSA4LjUwNjA0NjY5LDE0Ljk2ODc1IDguNzA2MjUsMTQuOTY4NzUgTDguNzA2MjUwMDMsMTQuOTY4NzUgWiIgaWQ9IuW9oueKtiIgZmlsbD0iI0ZGRkZGRiIgZmlsbC1ydWxlPSJub256ZXJvIj48L3BhdGg+CiAgICAgICAgICAgICAgICAgICAgPGcgaWQ9InNwYXJrIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg0LjAwMDAwMCwgNy4wMDAwMDApIiBmaWxsPSIjRkZGRkZGIj4KICAgICAgICAgICAgICAgICAgICAgICAgPGNpcmNsZSBpZD0i5qSt5ZyG5b2iIiBjeD0iMC42IiBjeT0iMC42IiByPSIxIj48L2NpcmNsZT4KICAgICAgICAgICAgICAgICAgICAgICAgPGNpcmNsZSBpZD0i5qSt5ZyG5b2i5aSH5Lu9IiBjeD0iMC42IiBjeT0iNC4xIiByPSIxIj48L2NpcmNsZT4KICAgICAgICAgICAgICAgICAgICAgICAgPGNpcmNsZSBpZD0i5qSt5ZyG5b2i5aSH5Lu9LTIiIGN4PSIwLjYiIGN5PSI3LjYiIHI9IjEiPjwvY2lyY2xlPgogICAgICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgPC9nPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+';
export const ICON_DEFAULT_TOKEN =
  'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMzNweCIgaGVpZ2h0PSIzM3B4IiB2aWV3Qm94PSIwIDAgMzMgMzMiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDYxLjIgKDg5NjUzKSAtIGh0dHBzOi8vc2tldGNoLmNvbSAtLT4KICAgIDx0aXRsZT5Ub2tlbnM8L3RpdGxlPgogICAgPGRlc2M+Q3JlYXRlZCB3aXRoIFNrZXRjaC48L2Rlc2M+CiAgICA8ZyBpZD0i6aG16Z2iLTEiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICAgIDxnIGlkPSLnlLvmnb8iIHRyYW5zZm9ybT0idHJhbnNsYXRlKC00NzUuMDAwMDAwLCAtMzEuMDAwMDAwKSI+CiAgICAgICAgICAgIDxnIGlkPSJUb2tlbnMiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDQ2My4wMDAwMDAsIDE4LjAwMDAwMCkiPgogICAgICAgICAgICAgICAgPGcgaWQ9Ik1haW4iIHRyYW5zZm9ybT0idHJhbnNsYXRlKDEyLjAwMDAwMCwgMTMuMDAwMDAwKSI+CiAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTE0LjA5Mzc5NDEsOS42MTI5NjI4NiBDMTMuODI1MTcwNSw5LjIzMjgzNDcgMTMuMzU0NjM0MSw5LjAwMTM2MzM1IDEyLjg0Nzc5NjcsOSBMNC4xNTUyOTU4Niw5IEMzLjY0NTgzNTIxLDguOTk5MTE2MzYgMy4xNzE5MzgxMiw5LjIzMDg3MDA1IDIuOTAxOTI0ODUsOS42MTI5NjI4NyBMMC4yMjU2MTM1MjcsMTMuNDAxNDg4OCBDLTAuMTE4NTc4MzcxLDEzLjg4NjUyMzggLTAuMDY0NzQ2MDY4OCwxNC41MTMzOTYyIDAuMzU4MzIzMzY0LDE0Ljk0Njg4NyBMNy45Mzc1MjYzNCwyMi43NzE3MTM4IEM4LjIwMjE2NjI4LDIzLjA0NTQxMDcgOC42Njc1Njc0MywyMy4wNzc1NDY0IDguOTc3MDMwNTIsMjIuODQzNDkxNiBDOS4wMDYxNTA3MywyMi44MjE0NjcyIDkuMDMzMjg1MzEsMjIuNzk3NDY4NiA5LjA1ODE4NzY5LDIyLjc3MTcxMzggTDE2LjYzNzM5MDcsMTQuOTQ2ODg3IEMxNy4wNjI4MDQxLDE0LjUxNDg3ODIgMTcuMTE5NjMzNywxMy44ODc5MTQzIDE2Ljc3NzQ3MzIsMTMuNDAxNDg4OCBMMTQuMDkzNzk0MSw5LjYxMjk2Mjg2IFoiIGlkPSLot6/lvoQiIGZpbGw9IiNDNEM2RDIiIGZpbGwtcnVsZT0ibm9uemVybyI+PC9wYXRoPgogICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0yNi43Nzc2MDcyLDE4LjQ2NTY5MjYgQzI2LjU3MjE4OTIsMTguMTc2ODkzOSAyNi4yMTIzNjczLDE4LjAwMTAzNTggMjUuODI0Nzg1NywxOCBMMTkuMTc3NTc5MiwxOCBDMTguNzg3OTkxNiwxNy45OTkzMjg3IDE4LjQyNTU5OTcsMTguMTc1NDAxMyAxOC4yMTkxMTksMTguNDY1NjkyNiBMMTYuMTcyNTI4LDIxLjM0Mzk4ODIgQzE1LjkwOTMyMjQsMjEuNzEyNDg4OSAxNS45NTA0ODgzLDIyLjE4ODc0OSAxNi4yNzQwMTIsMjIuNTE4MDg5NCBMMjIuMDY5ODczMSwyOC40NjI5MjU0IEMyMi4yNzIyNDQ4LDI4LjY3MDg2NCAyMi42MjgxMzk4LDI4LjY5NTI3ODcgMjIuODY0Nzg4LDI4LjUxNzQ1NzkgQzIyLjg4NzA1NjQsMjguNTAwNzI1MSAyMi45MDc4MDY0LDI4LjQ4MjQ5MjQgMjIuOTI2ODQ5NCwyOC40NjI5MjU0IEwyOC43MjI3MTA1LDIyLjUxODA4OTQgQzI5LjA0ODAyNjYsMjIuMTg5ODc1IDI5LjA5MTQ4NDYsMjEuNzEzNTQ1MiAyOC44Mjk4MzI1LDIxLjM0Mzk4ODIgTDI2Ljc3NzYwNzIsMTguNDY1NjkyNiBaIiBpZD0i6Lev5b6EIiBmaWxsPSIjN0Y4Mjk2IiBmaWxsLXJ1bGU9Im5vbnplcm8iPjwvcGF0aD4KICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMjUuNTgwOTM0MiwzLjc0NDMxMjcyIEMyNS4yNjQ5MDY1LDMuMjgyNzI4MTEgMjQuNzExMzM0MywzLjAwMTY1NTQ5IDI0LjExNTA1NSwzIEwxMy44ODg1ODM0LDMgQzEzLjI4OTIxNzksMi45OTg5MjcwMSAxMi43MzE2OTE5LDMuMjgwMzQyNDYgMTIuNDE0MDI5MiwzLjc0NDMxMjc0IEw5LjI2NTQyNzY4LDguMzQ0NjY5ODMgQzguODYwNDk2MDMsOC45MzM2NDE0OSA4LjkyMzgyODE1LDkuNjk0ODQ0MzMgOS40MjE1NTY5LDEwLjIyMTIyNjUgTDE4LjMzODI2NjMsMTkuNzIyODEwNiBDMTguNjQ5NjA3NCwyMC4wNTUxNTcxIDE5LjE5NzEzODIsMjAuMDk0MTc5MSAxOS41NjEyMTI0LDE5LjgwOTk2OTUgQzE5LjU5NTQ3MTQsMTkuNzgzMjI1NSAxOS42MjczOTQ1LDE5Ljc1NDA4NDMgMTkuNjU2NjkxNCwxOS43MjI4MTA2IEwyOC41NzM0MDA4LDEwLjIyMTIyNjUgQzI5LjA3Mzg4NzEsOS42OTY2NDM5NSAyOS4xNDA3NDU2LDguOTM1MzI5ODggMjguNzM4MjAzOCw4LjM0NDY2OTgyIEwyNS41ODA5MzQyLDMuNzQ0MzEyNzIgWiIgaWQ9Iui3r+W+hCIgZmlsbD0iIzRDNEY2MCIgZmlsbC1ydWxlPSJub256ZXJvIj48L3BhdGg+CiAgICAgICAgICAgICAgICAgICAgPGcgaWQ9InNwYXJrIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgyLjAwMDAwMCwgMTAuMDAwMDAwKSIgZmlsbD0iI0ZGRkZGRiI+CiAgICAgICAgICAgICAgICAgICAgICAgIDxyZWN0IGlkPSLnn6nlvaIiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDE0LjAwMDAwMCwgNC42MDAwMDApIHJvdGF0ZSg0Ny4wMDAwMDApIHRyYW5zbGF0ZSgtMTQuMDAwMDAwLCAtNC42MDAwMDApICIgeD0iMTAiIHk9IjQiIHdpZHRoPSI4IiBoZWlnaHQ9IjEuMiIgcng9IjAuNiI+PC9yZWN0PgogICAgICAgICAgICAgICAgICAgICAgICA8cmVjdCBpZD0i55+p5b2i5aSH5Lu9IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg0LjAwMDAwMCwgOC42MDAwMDApIHJvdGF0ZSg0Ny4wMDAwMDApIHRyYW5zbGF0ZSgtNC4wMDAwMDAsIC04LjYwMDAwMCkgIiB4PSIwLjUiIHk9IjgiIHdpZHRoPSI3IiBoZWlnaHQ9IjEuMiIgcng9IjAuNiI+PC9yZWN0PgogICAgICAgICAgICAgICAgICAgICAgICA8cmVjdCBpZD0i55+p5b2i5aSH5Lu9LTIiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDE5LjI1MDAwMCwgMTUuNjAwMDAwKSByb3RhdGUoNDcuMDAwMDAwKSB0cmFuc2xhdGUoLTE5LjI1MDAwMCwgLTE1LjYwMDAwMCkgIiB4PSIxNyIgeT0iMTUiIHdpZHRoPSI0LjUiIGhlaWdodD0iMS4yIiByeD0iMC42Ij48L3JlY3Q+CiAgICAgICAgICAgICAgICAgICAgICAgIDxjaXJjbGUgaWQ9IuakreWchuW9oiIgY3g9IjEwIiBjeT0iMC41IiByPSIxIj48L2NpcmNsZT4KICAgICAgICAgICAgICAgICAgICAgICAgPGNpcmNsZSBpZD0i5qSt5ZyG5b2i5aSH5Lu9LTMiIGN4PSIwLjUiIGN5PSI1IiByPSIxIj48L2NpcmNsZT4KICAgICAgICAgICAgICAgICAgICAgICAgPGNpcmNsZSBpZD0i5qSt5ZyG5b2i5aSH5Lu9LTQiIGN4PSIxNi41IiBjeT0iMTIuNSIgcj0iMSI+PC9jaXJjbGU+CiAgICAgICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICA8L2c+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4=';

export const POS_NULL_ADDRESS =
  '0000000000000000000000000000000000000000000000000000000000000000';

// only deploy on testnet and mainnet
enum FC_ADDRESSES {
  mainnet = 'cfx:achc8nxj7r451c223m18w2dwjnmhkd6rxawrvkvsy2',
  testnet = 'cfxtest:achteu1f777f1j1s8s4tvsx5vk5vcbrn4ykxa0fzg1',
}
export const FC_ADDRESS = IS_TESTNET
  ? FC_ADDRESSES.testnet
  : FC_ADDRESSES.mainnet;

// only deploy on testnet and mainnet
enum FC_EXCHANGE_ADDRESSES {
  mainnet = 'cfx:acdrd6ahf4fmdj6rgw4n9k4wdxrzfe6ex6jc7pw50m',
  testnet = 'cfxtest:acf6wwargxpp9ddfe7rnagf2ty9gsxs54uptst589y',
}
export const FC_EXCHANGE_ADDRESS = IS_TESTNET
  ? FC_EXCHANGE_ADDRESSES.testnet
  : FC_EXCHANGE_ADDRESSES.mainnet;

// only deploy on testnet and mainnet
enum FC_EXCHANGE_INTEREST_ADDRESSES {
  mainnet = 'cfx:acag8dru4527jb1hkmx187w0c7ymtrzkt2schxg140',
  testnet = 'cfxtest:acadrvdd07u69hazg0nkjkpdetvyc5wma6put8949d',
}
export const FC_EXCHANGE_INTEREST_ADDRESS = IS_TESTNET
  ? FC_EXCHANGE_INTEREST_ADDRESSES.testnet
  : FC_EXCHANGE_INTEREST_ADDRESSES.mainnet;

enum CROSS_SPACE_ADDRESSES {
  mainnet = 'cfx:aaejuaaaaaaaaaaaaaaaaaaaaaaaaaaaa2sn102vjv',
  testnet = 'cfxtest:aaejuaaaaaaaaaaaaaaaaaaaaaaaaaaaa2eaeg85p5',
}
export const CROSS_SPACE_ADDRESS = IS_TESTNET
  ? CROSS_SPACE_ADDRESSES.testnet
  : CROSS_SPACE_ADDRESSES.mainnet;

let APIHost = IS_TESTNET
  ? 'api-testnet.confluxscan.net'
  : 'api.confluxscan.net';
if (window.location.host.startsWith('net')) {
  APIHost = window.location.host.replace(/cfx|eth/, 'api');
}

export const OPEN_API_HOST = APIHost;

export const OPEN_API_URLS = Object.entries({
  // charts
  mining: '/statistics/mining',
  supply: '/statistics/supply',
  tps: '/statistics/tps',
  tx: '/statistics/transaction',
  tokenTransfer: '/statistics/token/transfer',
  cfxTransfer: '/statistics/cfx/transfer',
  cfxHolderAccounts: '/statistics/account/cfx/holder',
  accountGrowth: '/statistics/account/growth',
  activeAccounts: '/statistics/account/active',
  contracts: '/statistics/contract',

  // NFT
  NFTTokens: '/nft/tokens',
  NFTBalance: '/nft/balances',
})
  .map(item => ({
    [item[0]]: `https://${OPEN_API_HOST}${item[1]}`,
  }))
  .reduce((prev, curr) => ({ ...prev, ...curr }), {});

// not open abi, use backend api temp
// PoW
OPEN_API_URLS.contract = '/stat/contract/stat/list';
OPEN_API_URLS.token = '/stat/daily-token-stat';

// PoS
OPEN_API_URLS.PoSFinalizedInterval = '/stat/pos-daily-finalize-gap';
OPEN_API_URLS.PoSDailyAccounts = '/stat/pos-daily-account';
OPEN_API_URLS.PoSDailyStaking = '/stat/pos-daily-staking';
OPEN_API_URLS.PoSDailyAPY = '/stat/pos-daily-apy';
OPEN_API_URLS.PoSTotalReward = '/stat/pos-daily-total-reward';
OPEN_API_URLS.PoSDailyRewardRank = '/stat/pos-recent-reward-rank';
OPEN_API_URLS.PoSDailyDeposit = '/stat/pos-daily-deposit-withdraw';
OPEN_API_URLS.PoSDailyParticipationRate = '/stat/pos-daily-participation-rate';

// Cross Space
OPEN_API_URLS.CrossSpaceDailyCFXTransfer = '/stat/cross-space-cfx';

// table list list limit, max query items is 10,000, exceed will cause backend error
export const TABLE_LIST_LIMIT = 10000;
