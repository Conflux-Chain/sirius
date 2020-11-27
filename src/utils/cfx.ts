import {
  Conflux,
  util as cfxUtil,
} from 'js-conflux-sdk/dist/js-conflux-sdk.umd.min.js';
import { Faucet } from 'conflux-sponsorfaucet';
import { isTestNetEnv } from './hooks/useTestnet';
const cfxUrl = window.location.origin + '/rpc';

const cfx = new Conflux({
  url: cfxUrl,
});
const mainnetFaucetAddress = '0x8d5adbcaf5714924830591586f05302bf87f74bd';
const testnetFaucetAddress = '0x830394d63c6141d1ed172d9159bb130480ebe594';
const faucetAddress = isTestNetEnv()
  ? testnetFaucetAddress
  : mainnetFaucetAddress;
const faucet = new Faucet(cfxUrl, faucetAddress);
export const decodeContract = ({ abi, address, transacionData }) => {
  const contract = cfx.Contract({ abi, address });
  return contract.abi.decodeData(transacionData);
};
export { cfx, faucetAddress, faucet, cfxUtil };
