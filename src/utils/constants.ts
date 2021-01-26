import { formatAddress } from './cfx';

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
  erc20: 'erc20',
  erc721: 'erc721',
  erc1155: 'erc1155',
};
