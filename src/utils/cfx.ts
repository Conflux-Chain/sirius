import {
  Conflux,
  util as cfxUtil,
} from 'js-conflux-sdk/dist/js-conflux-sdk.umd.min.js';
import { Faucet } from 'sponsorfaucet';
const cfxUrl = window.location.origin + '/rpc';

const cfx = new Conflux({
  url: cfxUrl,
});
const faucetAddress = '0x87db0af39274b50e1e15aedc0d3a9316a7b00ce7';
const faucet = new Faucet(cfxUrl, faucetAddress);
export const decodeContract = ({ abi, address, transacionData }) => {
  const contract = cfx.Contract({ abi, address });
  return contract.abi.decodeData(transacionData);
};
export { cfx, faucetAddress, faucet, cfxUtil };
