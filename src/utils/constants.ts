import { formatAddress } from './cfx';
import { isTestNetEnv } from './hooks/useTestnet';

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
  cfx: 'CFX',
};
export const governanceAddressTestnet =
  '0x8f3f525d17159351e4b34fe766ef139470da0b02';
export const governanceAddressMainnet =
  '0x8f165e7d7dfb02e24300f2c1c476822ba895638e';
export const governanceAddress = isTestNetEnv()
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
}
