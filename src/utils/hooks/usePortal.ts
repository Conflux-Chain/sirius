import { NETWORK_ID } from 'utils/constants';
import {
  useStatus,
  useAccount,
  useChainId,
  connect,
  sendTransaction,
  useBalance,
} from '@cfx-kit/react-utils/dist/AccountManage';

export enum AuthConnectStatus {
  Connected = 'connected',
  Connecting = 'connecting',
  NotConnected = 'not-connected',
  NotChainMatch = 'not-chainMatch',
}

const walletName = 'Fluent';

export const usePortal = () => {
  const status = useStatus();
  const account = useAccount();
  const chainId = useChainId();

  const isChainMatch = chainId && Number(chainId) === NETWORK_ID;

  const authConnectStatus = account
    ? isChainMatch
      ? AuthConnectStatus.Connected
      : AuthConnectStatus.NotChainMatch
    : status === 'in-activating'
    ? AuthConnectStatus.Connecting
    : AuthConnectStatus.NotConnected;

  const installed = status !== 'not-installed';

  const login = () => {
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
    account: account ? account : undefined,
    chainId, // hex value, 0xNaN mean changing network
    // 用户调用这个函数尤其需要小心，因为如果未登录，只要调用函数，就会在钱包上请求一次连接，因尽量在 useEffectOnce 中使用
    login,
    useBalance,
    sendTransaction,
  };
};
