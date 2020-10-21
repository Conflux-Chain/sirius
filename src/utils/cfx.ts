import {
  Conflux,
  util as cfxUtil,
} from 'js-conflux-sdk/dist/js-conflux-sdk.umd.min.js';
import { Faucet } from 'sponsorfaucet';
const cfxUrl = window.location.origin + '/rpc';

const cfx = new Conflux({
  url: cfxUrl,
});
const faucetAddress = '0x8bf6b31e46d54e511b0547a397458922e83d9d28';
const faucet = new Faucet(cfxUrl, faucetAddress);
export const decodeContract = ({ abi, address, transacionData }) => {
  const contract = cfx.Contract({ abi, address });
  return contract.abi.decodeData(transacionData);
};
export { cfx, faucetAddress, faucet, cfxUtil };
