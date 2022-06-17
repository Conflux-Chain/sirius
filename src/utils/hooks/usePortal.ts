import Wallet from '@cfxjs/use-wallet';
export { Unit } from '@cfxjs/use-wallet';
// @ts-ignore
const FluentWallet = new Wallet('conflux', { mustBeFluent: true });

export const store = FluentWallet.store;
export const provider = FluentWallet.provider;
export const completeDetect = FluentWallet.completeDetect;
export const connect = FluentWallet.connect;
export const sendTransaction = FluentWallet.sendTransaction;
export const addChain = FluentWallet.addChain;
export const switchChain = FluentWallet.switchChain;
export const watchAsset = FluentWallet.watchAsset;
export const personalSign = FluentWallet.personalSign;
export const typedSign = FluentWallet.typedSign;
export const trackBalanceChangeOnce = FluentWallet.trackBalanceChangeOnce;
export const useStatus = FluentWallet.useStatus;
export const useAccount = FluentWallet.useAccount;
export const useChainId = FluentWallet.useChainId;
export const useBalance = FluentWallet.useBalance;

// @todo 是否应该和 @cfxjs/react-hooks 合并到一起？
export const usePortal = () => {
  const status = useStatus();
  const account = useAccount();
  const balance = useBalance();
  const chainId = useChainId();

  const connected = ['not-installed', 'not-active'].includes(status)
    ? 0
    : status === 'in-activating'
    ? 2
    : 1; // 0 - not connect, 1 - connected, 2 - connecting
  const installed = status === 'not-installed' ? 0 : 1; // 0 - not install, 1 - installed

  const login = () => {
    if (connected === 0) {
      return connect();
    }
    return Promise.reject('wallet is connected');
  };

  return {
    installed,
    connected,
    accounts: account ? [account] : [],
    chainId, // hex value, 0xNaN mean changing network
    // 用户调用这个函数尤其需要小心，因为如果未登录，只要调用函数，就会在钱包上请求一次连接，因尽量在 useEffectOnce 中使用
    login,
    provider,
    balance: balance ? balance.toDecimalStandardUnit() : 0, // not use now,
    sendTransaction,
  };
};
