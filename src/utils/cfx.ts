import {
  Conflux,
  format as cfxFormat,
  address as cfxAddress,
} from 'js-conflux-sdk/dist/js-conflux-sdk.umd.min.js';
import { Faucet } from 'conflux-sponsorfaucet';
import { isTestNetEnv } from './hooks/useTestnet';
const cfxUrlV2 = window.location.origin + '/rpcv2'; // cip-37
const cfxUrl = window.location.origin + '/rpc'; // cip-37

const mainNetworkId = 1029;
const testnetNetworkId = 1;
// do not support other private network
const networkId = isTestNetEnv() ? testnetNetworkId : mainNetworkId;

const cfx = new Conflux({
  url: cfxUrlV2,
  networkId,
  // https://github.com/Conflux-Chain/js-conflux-sdk/blob/new-checksum/CHANGE_LOG.md#v150
  // use hex address to compatible with history function
  // cip-37
  // useHexAddressInParameter: true,
});

const cfxOld = new Conflux({
  url: cfxUrl,
  networkId,
  // https://github.com/Conflux-Chain/js-conflux-sdk/blob/new-checksum/CHANGE_LOG.md#v150
  // use hex address to compatible with history function
  // cip-37
  useHexAddressInParameter: true,
});

cfx.getClientVersion().then(v => {
  console.log('conflux-network-version:', v);
});

// global show hex address switch
export const getGlobalShowHexAddress = () => {
  return localStorage.getItem('conflux-scan-show-hex-address') === 'true';
};

/**
 * format cfx address
 * @param address origin address
 * @param option address format options
 */
const formatAddress = (address: string | undefined, option: any = {}) => {
  if (!address || address.length < 40) return '';
  const addressOptions = Object.assign(
    {
      networkId,
      hex: getGlobalShowHexAddress(),
      withType: false,
    },
    option,
  );
  try {
    if (addressOptions.hex) {
      return cfxFormat.hexAddress(
        cfxFormat.address(address, addressOptions.networkId),
      );
    }
    if (!addressOptions.withType) {
      // TODO simplifyCfxAddress
      return cfxFormat.address(
        cfxFormat.hexAddress(address),
        addressOptions.networkId,
      );
    }
    return cfxFormat.address(
      address,
      addressOptions.networkId,
      addressOptions.withType,
    );
  } catch (e) {
    console.warn('formatAddress:', address, e.message);
    // transfer to is not valid conflux address, need show error tip
    return address.startsWith('0x') && address.length === 42
      ? 'invalid-' + address
      : '';
  }
};

// faucet address

const mainnetFaucetAddress = formatAddress(
  '0x829985ed802802e0e4bfbff25f79ccf5236016e9',
  { hex: true },
); // cip-37 use hex;
const mainnetFaucetLastAddress = formatAddress(
  '0x8d5adbcaf5714924830591586f05302bf87f74bd',
  { hex: true },
); // cip-37 use hex;
const testnetFaucetAddress = formatAddress(
  '0x8fc71dbd0e0b3be34fbee62796b65e09c8fd19b8',
  { hex: true },
); // cip-37 use hex;
const testnetFaucetLastAddress = formatAddress(
  '0x8097e818c2c2c1524c41f0fcbda143520046d117',
  { hex: true },
); // cip-37 use hex;

const faucetAddress = isTestNetEnv()
  ? testnetFaucetAddress
  : mainnetFaucetAddress;
const faucetLastAddress = isTestNetEnv()
  ? testnetFaucetLastAddress
  : mainnetFaucetLastAddress;

// contract manager address

const testnetContractManagerAddress = formatAddress(
  '0x81bbe80b1282387e19d7e1a57476869081c7d965',
  { networkId: testnetNetworkId },
);
const mainnetContractManagerAddress = formatAddress(
  '0x81bbe80b1282387e19d7e1a57476869081c7d965',
  { networkId: testnetNetworkId },
);
const contractManagerAddress = isTestNetEnv()
  ? testnetContractManagerAddress
  : mainnetContractManagerAddress;

const faucet = new Faucet(cfxUrl, faucetAddress, faucetLastAddress);

export const decodeContract = ({ abi, address, transacionData }) => {
  const contract = cfx.Contract({ abi, address });
  return contract.abi.decodeData(transacionData);
};

export {
  cfx,
  cfxOld,
  formatAddress,
  faucetAddress,
  faucet,
  cfxFormat,
  cfxAddress,
  contractManagerAddress,
  networkId,
  mainNetworkId,
  testnetNetworkId,
};
