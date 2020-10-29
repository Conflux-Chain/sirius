import {
  Conflux,
  util as cfxUtil,
} from 'js-conflux-sdk/dist/js-conflux-sdk.umd.min.js';
import { Faucet } from 'conflux-sponsorfaucet';
const cfxUrl = window.location.origin + '/rpc';

const cfx = new Conflux({
  url: cfxUrl,
});
const faucetAddress = '0x8d5adbcaf5714924830591586f05302bf87f74bd';
const faucet = new Faucet(cfxUrl, faucetAddress);
export const decodeContract = ({ abi, address, transacionData }) => {
  const contract = cfx.Contract({ abi, address });
  return contract.abi.decodeData(transacionData);
};
export { cfx, faucetAddress, faucet, cfxUtil };
