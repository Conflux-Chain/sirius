import { useEffect, useState } from 'react';
import Big from 'bignumber.js';
import { useEffectOnce } from 'react-use';
import { useConfluxPortal } from '@cfxjs/react-hooks';
import { fcAddress, cETHAddress } from './../cfx';

// alias for window
const globalThis = window as any;

const installed = globalThis?.conflux?.isConfluxPortal;

// chain id hook
const useChainId = (outerChainId?) => {
  if (!installed) {
    return [null, () => {}];
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [chainId, setChainId] = useState(
    outerChainId || globalThis.conflux.chainId,
  );

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffectOnce(() => {
    const chainIdHandler = id => {
      setChainId(id);
    };
    globalThis.conflux.on('chainChanged', chainIdHandler);
    return () => {
      globalThis.conflux.off('chainChanged', chainIdHandler);
    };
  });

  // 解决初始化页面的时候，无法读取 conflux.chainId 问题
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    const globalThisChainId = globalThis.conflux.chainId;
    if (globalThisChainId !== chainId) {
      setChainId(globalThisChainId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [globalThis.conflux.chainId]);

  return [chainId, setChainId];
};

// account address hook
export const useAccounts = (outerAccounts?) => {
  if (!installed) {
    return [[], () => {}];
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [accounts, setAccounts] = useState(
    outerAccounts || globalThis.conflux.selectedAddress
      ? [globalThis.conflux.selectedAddress]
      : [],
  );

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffectOnce(() => {
    const accountsHandler = newAccounts => {
      setAccounts(newAccounts);
    };
    globalThis.conflux.on('accountsChanged', accountsHandler);
    return () => {
      globalThis.conflux.off('accountsChanged', accountsHandler);
    };
  });

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    const globalThisAccounts = globalThis.conflux.selectedAddress
      ? [globalThis.conflux.selectedAddress]
      : [];
    if (globalThisAccounts[0] !== accounts[0]) {
      setAccounts(globalThisAccounts);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [globalThis.conflux.selectedAddress]);

  return [accounts, setAccounts];
};

// login hook
const useLogin = (outerConnected?, outerAccounts?) => {
  const [accounts, setAccounts] = useAccounts(outerAccounts);

  if (!installed) {
    return { connected: 0, accounts, login: () => {}, ensureLogin: () => {} };
  }

  // 0 - not connect, 1 - connected, 2 - connecting
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [connected, setConnected] = useState(
    outerConnected || accounts[0] ? 1 : 0,
  );

  // 登录功能 + 登录状态同步
  const login = () => {
    if (!accounts.length) {
      setConnected(2);
      globalThis.conflux
        ?.enable()
        ?.then(accounts => {
          setConnected(1);
          // @todo why need to check setAccount type ?
          typeof setAccounts === 'function' && setAccounts(accounts);
        })
        ?.catch(e => {
          setConnected(0);
        });
    }
  };

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    setConnected(accounts[0] ? 1 : 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accounts[0]]);

  const ensureLogin = () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffectOnce(login);
  };

  return { connected, accounts, login, ensureLogin };
};

// @todo 是否应该和 @cfxjs/react-hooks 合并到一起？
export const usePortal = () => {
  if (!installed) {
    return {
      installed: 0,
      connected: 0, // 0 - not connect, 1 - connected, 2 - connecting
      accounts: [],
      chainId: null, // hex value, 0xNaN mean changing network
      // @todo check balances value
      balances: {
        // numeric string, NaN mean no such asset
        cfx: '0',
        fc: '0',
        ceth: '0',
      },
      // 用户调用这个函数尤其需要小心，因为如果未登录，只要调用函数，就会在钱包上请求一次连接，因尽量在 useEffectOnce 中使用
      login: () => {},
      ensureLogin: () => {},
      Big: null,
      conflux: null,
      confluxJS: null,
      ConfluxJSSDK: null,
    };
  }

  // prevent portal auto refresh when user changes the network
  if (globalThis?.conflux?.autoRefreshOnNetworkChange)
    globalThis.conflux.autoRefreshOnNetworkChange = false;

  // TODO cip-37 portal
  const {
    balances: [balance, [fc, ceth]],
    // eslint-disable-next-line react-hooks/rules-of-hooks
  } = useConfluxPortal([
    fcAddress, // fc contract address, can be find on confluxscan.io
    cETHAddress, // ceth contract address, can be find on confluxscan.io
  ]);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [chainId] = useChainId();
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { connected, accounts, login, ensureLogin } = useLogin();

  return {
    installed: Number(installed), // 0 - not install, 1 - installed
    connected, // 0 - not connect, 1 - connected, 2 - connecting
    accounts,
    chainId, // hex value, 0xNaN mean changing network
    // @todo check balances value
    balances: {
      // numeric string, NaN mean no such asset
      cfx: new Big(balance).dividedBy(1e18).toString(),
      fc: new Big(fc).dividedBy(1e18).toString(),
      ceth: new Big(ceth).dividedBy(1e18).toString(),
    },
    // 用户调用这个函数尤其需要小心，因为如果未登录，只要调用函数，就会在钱包上请求一次连接，因尽量在 useEffectOnce 中使用
    login,
    ensureLogin,
    Big,
    conflux: globalThis.conflux,
    confluxJS: globalThis.confluxJS,
    ConfluxJSSDK: globalThis.ConfluxJSSDK,
  };
};

export { Big, installed };
export const conflux = globalThis?.conflux;
export const confluxJS = globalThis?.confluxJS;
export const ConfluxJSSDK = globalThis?.ConfluxJSSDK;
