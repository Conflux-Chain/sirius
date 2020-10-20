import {
  Conflux,
  util as cfxUtil,
} from 'js-conflux-sdk/dist/js-conflux-sdk.umd.min.js';
import { Faucet } from 'sponsorfaucet';
import { delay } from './index';
import { transferRisk } from './format';
const cfxUrl = window.location.origin + '/rpc';

const cfx = new Conflux({
  url: cfxUrl,
});
const faucetAddress = '0x8bf6b31e46d54e511b0547a397458922e83d9d28';
const faucet = new Faucet(cfxUrl, faucetAddress);

export const reqConfirmationRiskByHash = async (blockHash: string) => {
  try {
    const callProvider = () => {
      return cfx.provider.call(
        'cfx_getConfirmationRiskByHash',
        cfxUtil.format.blockHash(blockHash),
      );
    };
    let result = await callProvider();
    if (!result) {
      // retry when result is null or empty
      await delay(3000);
      result = await callProvider();
    }
    if (result) {
      return transferRisk(result.toString());
    }
    return '';
  } catch (e) {
    return '';
  }
};

export { cfx, faucetAddress, faucet };
