import BigNumber from 'bignumber.js';
import { cfx } from '../cfx';

//sponsor faucet contract abi
import faucetContract from './SponsorFaucet.js';

//suggested factor to make sure gas is enough
const gas_estimation_ratio_withdraw = 1.8;
const gas_estimation_ratio_default = 1.3;

class Faucet {
  /**
   * @dev constructor for faucet
   * @param url The conflux provider url
   * @param address The faucet contract address
   * @param lastAddress The last faucet contract address
   */
  constructor(url, address, lastAddress) {
    this.cfx = cfx;
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
      faucetParams = await this.getFaucetParams(dapp);
      sponsorInfo = await this.cfx.getSponsorInfo(dapp);
      collateralForStorage = new BigNumber(
        await this.cfx.getCollateralForStorage(dapp),
      );
      collateralBound = new BigNumber(faucetParams.collateral_bound);
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
}

export default Faucet;
