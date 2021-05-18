import { formatAddress } from './cfx';
import { isTestNetEnv } from './hooks/useTestnet';

const IS_TESTNET = isTestNetEnv();

export const addressTypeContract = 'contract';
export const addressTypeCommon = 'common';
export const addressTypeInternalContract = 'internalContract';
export const adminControlAddress = formatAddress(
  '0x0888000000000000000000000000000000000000',
);
export const sponsorWhitelistControlAddress = formatAddress(
  '0x0888000000000000000000000000000000000001',
);
export const stakingAddress = formatAddress(
  '0x0888000000000000000000000000000000000002',
);
export const zeroAddress = formatAddress(
  '0x0000000000000000000000000000000000000000',
);
export const cfxTokenTypes = {
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
export const governanceAddressTestnet =
  '0x8f3f525d17159351e4b34fe766ef139470da0b02';
export const governanceAddressMainnet =
  '0x8f165e7d7dfb02e24300f2c1c476822ba895638e';
export const governanceAddress = IS_TESTNET
  ? governanceAddressTestnet
  : governanceAddressMainnet;

// same as connectWallet.notify.action in i18n file
export enum TxnAction {
  default = 100,
  contractWrite = 101,
  contractEdit = 102,
  writeContract = 103,
  readContract = 104,
  sponsorApplication = 105,
  contractDeplpy = 106,
  swapWCFXToCFX = 107,
  swapCFXToWCFX = 108,
}

export enum NETWORK_IDS {
  mainnet = 1029,
  testnet = 1,
}

export const NETWORK_ID = IS_TESTNET
  ? NETWORK_IDS.testnet
  : NETWORK_IDS.mainnet;

export enum ADDRESS_WCFXS {
  mainnet = 'cfx:acg158kvr8zanb1bs048ryb6rtrhr283ma70vz70tx',
  testnet = 'cfxtest:achs3nehae0j6ksvy1bhrffsh1rtfrw1f6w1kzv46t',
}

export const ADDRESS_WCFX = IS_TESTNET
  ? ADDRESS_WCFXS.testnet
  : ADDRESS_WCFXS.mainnet;

export enum ADDRESS_FCS {
  mainnet = 'cfx:achc8nxj7r451c223m18w2dwjnmhkd6rxawrvkvsy2',
  testnet = 'cfxtest:achkx35n7vngfxgrm7akemk3ftzy47t61yk5nn270s',
}

export const ADDRESS_FC = IS_TESTNET
  ? ADDRESS_FCS.testnet
  : ADDRESS_FCS.mainnet;

export enum ADDRESS_CETHS {
  mainnet = 'cfx:acdrf821t59y12b4guyzckyuw2xf1gfpj2ba0x4sj6',
  testnet = 'cfxtest:acdrf821t59y12b4guyzckyuw2xf1gfpj2nnfd6ep0',
}

export const ADDRESS_CETH = IS_TESTNET
  ? ADDRESS_CETHS.testnet
  : ADDRESS_CETHS.mainnet;

export enum LOCALSTORAGE_KEYS {
  currency = 'CONFLUX_SCAN_LOCALSTORAGE_KEY_CURRENCY',
}

export const CURRENCY_SYMBOLS = {
  USD: '$',
  CNY: '¥',
  GBP: '£',
  KRW: '₩',
  RUB: '₽',
  EUR: '€',
};

export const CURRENCY =
  localStorage.getItem(LOCALSTORAGE_KEYS.currency) || 'USD';

export const CURRENCY_SYMBOL = CURRENCY_SYMBOLS[CURRENCY];
