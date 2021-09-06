// https://github.com/Conflux-Chain/conflux-sponsor-faucet
import BigNumber from 'bignumber.js';

//sponsor faucet contract abi
import faucetContract from './SponsorFaucet.js';
import { CFX } from 'utils/constants';

//suggested factor to make sure gas is enough
const gas_estimation_ratio_withdraw = 1.8;
const gas_estimation_ratio_default = 1.3;

/**
 * @dev parse bytecode data to array
 * @param data
 */
function _parseBytecode(data) {
  let r = [];
  if (data.length > 0 && (data.length - 2) % 64 !== 0) return r;
  let tmp;
  for (let i = 2; i < data.length; i += 64) {
    tmp = new BigNumber('0x' + data.slice(i, i + 64));
    r.push(tmp);
  }
  return r;
}

class Faucet {
  /**
   * @dev constructor for faucet
   * @param url The conflux provider url
   * @param address The faucet contract address
   * @param lastAddress The last faucet contract address
   */
  constructor(url, address, lastAddress) {
    this.cfx = CFX;
    this.provider = this.cfx.provider;
    this.address = address;
    this.lastAddress = lastAddress;
    this.faucet = this.cfx.Contract({
      abi: faucetContract.abi,
      address: address,
    });
    //oldFaucet is used to query accumulated details, abi is compatible for this.
    this.oldFaucet = this.cfx.Contract({
      abi: faucetContract.abi,
      address: lastAddress,
    });
  }

  /**
   * @dev estimate contract func and return { gas: suggestedGas, data: contractCall }
   * @param callFunc contract function
   * @param params params of contract function
   */
  async estimateForContract(callFunc, params) {
    let estimateData = await callFunc(...params).estimateGasAndCollateral();
    let gas;
    if (callFunc === this.faucet.withdraw) {
      gas = new BigNumber(estimateData.gasUsed)
        .multipliedBy(gas_estimation_ratio_withdraw) //suggested value to make sure withdraw won't fail
        .integerValue()
        .toString();
    } else {
      gas = new BigNumber(estimateData.gasUsed)
        .multipliedBy(gas_estimation_ratio_default) //suggested value
        .integerValue()
        .toString();
    }
    let data = callFunc(...params).data;
    let rawTx = {
      gas: gas,
      data: data,
    };
    return rawTx;
  }

  /**
   * @dev apply sponsorship for special dapp
   * @param dapp The address of dapp
   */
  async apply(dapp) {
    return await this.estimateForContract(this.faucet.applyGasAndCollateral, [
      dapp,
    ]);
  }

  /**
   * @dev check if a dapp can be sponsored
   * @param dapp The address of dapp
   */
  async checkAppliable(dapp) {
    if (dapp === null)
      return { flag: false, message: 'Contract address not specified' };
    let r, sponsorInfo, faucetParams, collateralForStorage, oldDetail;
    let accumulatedCollateral, collateralBound;
    try {
      let res;
      let data = this.faucet.getBounds(dapp).data;
      res = await this.provider.batch([
        { method: 'cfx_call', params: [{ to: this.address, data: data }] },
        { method: 'cfx_getSponsorInfo', params: [dapp] },
        { method: 'cfx_getCollateralForStorage', params: [dapp] },
      ]);

      faucetParams = _parseBytecode(res[0]);
      sponsorInfo = res[1];
      collateralForStorage = new BigNumber(res[2]);
      collateralBound = faucetParams[3];

      if (sponsorInfo.sponsorForCollateral === this.lastAddress) {
        oldDetail = await this.oldFaucet.dapps(dapp).call();
        accumulatedCollateral = new BigNumber(oldDetail[1]);
        if (accumulatedCollateral.gte(collateralBound)) {
          return {
            flag: false,
            message: 'ERROR_COLLATERAL_CANNOT_REPLACE_OLD_FAUCET',
          };
        }
      } else if (
        sponsorInfo.sponsorForCollateral !== this.address &&
        collateralForStorage.gt(collateralBound)
      ) {
        return {
          flag: false,
          message: 'ERROR_COLLATERAL_CANNOT_REPLACE_THIRD_PARTY_SPONSOR',
        };
      }
    } catch (e) {
      return {
        flag: false,
        message: 'RPC ERROR:' + e.toString(),
      };
    }

    try {
      r = await this._isAppliableCall(dapp);
      return {
        flag: r,
        message: '',
      };
    } catch (e) {
      let message = e.toString();
      message = message
        .replace(
          `Error: Estimation isn't accurate: transaction is reverted. Execution output Reason provided by the contract: `,
          '',
        )
        .replace(/'/g, '');
      return {
        flag: false,
        message: message,
      };
    }
  }

  async _isAppliableCall(dapp) {
    let rawTx = await this.estimateForContract(this.faucet.isAppliable, [dapp]);
    let tx = {
      to: this.faucet.address,
      data: rawTx.data,
    };
    let res;
    try {
      res = await this.cfx.call(tx);
      return (
        res ===
        '0x0000000000000000000000000000000000000000000000000000000000000001'
      );
    } catch (e) {
      return e;
    }
  }

  /**
   * @dev withdraw from faucet
   * @param address address to accept fund
   * @param amount amount to withdraw
   */
  async withdraw(address, amount) {
    return await this.estimateForContract(this.faucet.withdraw, [
      address,
      amount,
    ]);
  }

  /**
   * @dev set bounds for sponsorship
   * @param gasTotalLimit total sponsored gas limit
   * @param collateralTotalLimit total sponsored collateral limit
   * @param gasBound single sponsor gas bound
   * @param collateralBound single sponsor collateral bound
   * @param upperBound upperBound for single tx gas
   */
  async setBounds(
    gasTotalLimit,
    collateralTotalLimit,
    gasBound,
    collateralBound,
    upperBound,
  ) {
    return await this.estimateForContract(this.faucet.setBounds, [
      gasTotalLimit,
      collateralTotalLimit,
      gasBound,
      collateralBound,
      upperBound,
    ]);
  }

  /**
   * @dev pause faucet
   */
  async pause() {
    return await this.estimateForContract(this.faucet.pause, []);
  }

  /**
   * @dev unpause faucet
   */
  async unpause() {
    return await this.estimateForContract(this.faucet.unpause, []);
  }

  /*** contract data helper ***/
  /**
   * @dev get bounds and limit params of faucet
   */
  async getFaucetParams(dapp) {
    let res;
    try {
      res = await this.faucet.getBounds(dapp).call();
      return {
        gas_total_limit: res[0],
        collateral_total_limit: res[1],
        gas_bound: res[2],
        collateral_bound: res[3],
        upper_bound: res[4],
      };
    } catch (e) {
      return e;
    }
  }

  /**
   * @dev get current accumulated sponsored amount of a dapp
   * @param dapp The address of dapp
   */
  async getAmountAccumulated(dapp) {
    let res = await this.faucet.dapps(dapp).call();
    return {
      gas_amount_accumulated: res[0],
      collateral_amount_accumulated: res[1],
    };
  }

  /**
   * @dev internal check function
   * @param data the data of contract
   * @param dapp the address of contract
   */
  async _checkAppliable(data, dapp) {
    let r = {};
    if (data.length !== 5) {
      r.isAppliable = { flag: false, message: 'Contract params not enough' };
      return r;
    }

    let collateralForStorage = new BigNumber(data[0]);
    let currentDetails = _parseBytecode(data[1]);
    let previousDetails = _parseBytecode(data[2]);
    let faucetParams = _parseBytecode(data[3]);
    let sponsorInfo = data[4];
    let collateralBound = faucetParams[3];
    let accumulatedCollateral = new BigNumber(previousDetails[1]);

    r.gas_amount_accumulated = currentDetails[0];
    r.collateral_amount_accumulated = currentDetails[1];
    r.gas_total_limit = faucetParams[0];
    r.collateral_total_limit = faucetParams[1];
    r.gas_bound = faucetParams[2];
    r.collateral_bound = faucetParams[3];
    r.upper_bound = faucetParams[4];
    r.sponsorInfo = sponsorInfo;

    let isAppliable;
    if (sponsorInfo.sponsorForCollateral === this.lastAddress) {
      if (accumulatedCollateral.gte(collateralBound)) {
        isAppliable = {
          flag: false,
          message: 'ERROR_COLLATERAL_CANNOT_REPLACE_OLD_FAUCET',
        };
      }
    } else if (
      sponsorInfo.sponsorForCollateral !== this.address &&
      collateralForStorage.gt(collateralBound)
    ) {
      isAppliable = {
        flag: false,
        message: 'ERROR_COLLATERAL_CANNOT_REPLACE_THIRD_PARTY_SPONSOR',
      };
    } else {
      try {
        let res = await this._isAppliableCall(dapp);
        isAppliable = {
          flag: res,
          message: '',
        };
      } catch (e) {
        let message = e.toString();
        message = message
          .replace(
            `Error: Estimation isn't accurate: transaction is reverted. Execution output Reason provided by the contract: `,
            '',
          )
          .replace(/'/g, '');
        isAppliable = {
          flag: false,
          message: message,
        };
      }
    }
    r.isAppliable = isAppliable;
    return r;
  }

  /**
   * @dev get all info for a contract
   * @param dapp the address of contract
   */
  async search(dapp) {
    let r = {};
    if (dapp === null) {
      r.isAppliable = {
        flag: false,
        message: 'Contract address not specified',
      };
      return r;
    }

    try {
      let res;
      let inputDetail = this.faucet.dapps(dapp).data;
      let inputBounds = this.faucet.getBounds(dapp).data;
      let inputOldDetail = this.oldFaucet.dapps(dapp).data;
      res = await this.provider.batch([
        { method: 'cfx_getCollateralForStorage', params: [dapp] },
        {
          method: 'cfx_call',
          params: [{ to: this.address, data: inputDetail }],
        },
        {
          method: 'cfx_call',
          params: [{ to: this.lastAddress, data: inputOldDetail }],
        },
        {
          method: 'cfx_call',
          params: [{ to: this.address, data: inputBounds }],
        },
        { method: 'cfx_getSponsorInfo', params: [dapp] },
      ]);
      r = await this._checkAppliable(res, dapp);
      return r;
    } catch (e) {
      r.isAppliable = { flag: false, message: 'RPC ERROR:' + e.toString() };
      return r;
    }
  }
}

export default Faucet;
