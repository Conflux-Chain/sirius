import { Conflux } from 'js-conflux-sdk/dist/js-conflux-sdk.umd.min.js';
import { Faucet } from 'sponsorfaucet';
const cfxUrl = window.location.origin + '/rpc';
const cfx = new Conflux({
  url: cfxUrl,
});
const faucetAddress = '0x8055899d3b239602a3b0b0b9aa03b7cadc204027';
const faucet = new Faucet(cfxUrl, faucetAddress);

export { cfx, faucetAddress, faucet };
