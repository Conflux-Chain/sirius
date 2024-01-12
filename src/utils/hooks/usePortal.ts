import { NETWORK_ID } from 'utils/constants';
import {
  useStatus,
  useAccount,
  useChainId,
  connect,
  sendTransaction,
  useBalance,
} from '@cfx-kit/react-utils/dist/AccountManage';
// TODO: multiple wallets handle
import { provider } from '@cfxjs/use-wallet-react/conflux/Fluent';

export enum AuthConnectStatus {
  Connected = 'connected',
  Connecting = 'connecting',
  NotConnected = 'not-connected',
  NotChainMatch = 'not-chainMatch',
}

// @todo 是否应该和 @cfxjs/react-hooks 合并到一起？
export const usePortal = () => {
  const status = useStatus();
  const account = useAccount();
  const balance = useBalance();
  const chainId = useChainId();

  const isChainMatch = chainId && Number(chainId) === NETWORK_ID;

  const authConnectStatus = account
    ? isChainMatch
      ? AuthConnectStatus.Connected
      : AuthConnectStatus.NotChainMatch
    : status === 'in-activating'
    ? AuthConnectStatus.Connecting
    : AuthConnectStatus.NotConnected;

  const installed = status === 'not-installed' ? 0 : 1; // 0 - not install, 1 - installed

  const login = (walletName: string) => {
    if (installed && authConnectStatus === AuthConnectStatus.NotConnected) {
      return connect(walletName);
    }
    return Promise.reject(
      !installed ? 'wallet is not installed' : 'wallet is connected',
    );
  };

  return {
    installed,
    authConnectStatus,
    accounts: account ? [account] : [],
    chainId, // hex value, 0xNaN mean changing network
    // 用户调用这个函数尤其需要小心，因为如果未登录，只要调用函数，就会在钱包上请求一次连接，因尽量在 useEffectOnce 中使用
    login,
    provider,
    balance,
    sendTransaction,
  };
};
