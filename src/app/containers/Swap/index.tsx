import React, { useEffect, useState } from 'react';
// import Big from 'bignumber.js';
import { Conflux } from 'js-conflux-sdk/dist/js-conflux-sdk.umd.min.js';
import { usePortal } from 'utils/hooks/usePortal';
import { abi } from 'utils/contract/wcfx.json';
import { ADDRESS_WCFX, NETWORK_ID } from 'utils/constants';

const cfx = new Conflux({
  networkId: NETWORK_ID,
});
// @ts-ignore
cfx.provider = window.conflux;

const contract = cfx.Contract({
  address: ADDRESS_WCFX,
  abi,
});

export function Swap() {
  const [wcfx, setWcfx] = useState('0');
  const {
    installed,
    accounts,
    balances: { cfx },
  } = usePortal();

  useEffect(() => {
    if (installed && accounts.length) {
      contract.balanceOf(accounts[0]).then(data => {
        console.log(111, data.toString());
        setWcfx(data.toString());
      });
    }

    // @ts-ignore
    // contract.abi
    //   .transfer(account, 10000000000000000000)
    //   .then(d => console.log(d))
    //   .catch(e => {
    //     console.log(e);
    //   });

    // // deposit 存款
    // const txnHash2 = contract
    //   .deposit()
    //   .sendTransaction({
    //     from: account,
    //     value: 3 * 1e18,
    //   })
    //   .then(console.log)
    //   .catch(console.log);
    // console.log(999, txnHash2);

    // // withdraw 取款
    // const txnHash2 = contract
    //   .withdraw(10 * 1e18)
    //   .sendTransaction({
    //     from: account,
    //   })
    //   .then(console.log)
    //   .catch(console.log);
    // console.log(999, txnHash2);
  }, [installed, accounts]);

  return <h1>swap</h1>;
}
