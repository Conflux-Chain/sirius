import { useEffect, useState } from 'react';
import Big from 'bignumber.js';
import { useEffectOnce } from 'react-use';

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
    return {
      connected: 0,
      accounts,
      login: () => Promise.resolve(),
    };
  }

  // 0 - not connect, 1 - connected, 2 - connecting
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [connected, setConnected] = useState(
    outerConnected || accounts[0] ? 1 : 0,
  );

  // 登录功能 + 登录状态同步
  const login = () =>
    new Promise((resolve, reject) => {
      if (!accounts.length) {
        setConnected(2);
        globalThis.conflux
          ?.enable()
          ?.then(accounts => {
            setConnected(1);
            // @todo why need to check setAccount type ?
            typeof setAccounts === 'function' && setAccounts(accounts);
            resolve(accounts);
          })
          ?.catch(e => {
            setConnected(0);
            reject(e);
          });
      }
    });

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    setConnected(accounts[0] ? 1 : 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accounts[0]]);

  return { connected, accounts, login };
};

// @todo 是否应该和 @cfxjs/react-hooks 合并到一起？
export const usePortal = () => {
  if (!installed) {
    return {
      installed: 0,
      connected: 0, // 0 - not connect, 1 - connected, 2 - connecting
      accounts: [],
      chainId: null, // hex value, 0xNaN mean changing network
      // 用户调用这个函数尤其需要小心，因为如果未登录，只要调用函数，就会在钱包上请求一次连接，因尽量在 useEffectOnce 中使用
      login: () => Promise.resolve(),
      Big: null,
      conflux: null,
      confluxJS: null,
      ConfluxJSSDK: null,
    };
  }

  // prevent portal auto refresh when user changes the network
  if (globalThis?.conflux?.autoRefreshOnNetworkChange)
    globalThis.conflux.autoRefreshOnNetworkChange = false;

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [chainId] = useChainId();
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { connected, accounts, login } = useLogin();

  return {
    installed: Number(installed), // 0 - not install, 1 - installed
    connected, // 0 - not connect, 1 - connected, 2 - connecting
    accounts,
    chainId, // hex value, 0xNaN mean changing network
    // 用户调用这个函数尤其需要小心，因为如果未登录，只要调用函数，就会在钱包上请求一次连接，因尽量在 useEffectOnce 中使用
    login,
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
