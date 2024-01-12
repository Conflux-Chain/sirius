import { registerWallet } from '@cfx-kit/react-utils/dist/AccountManage';
import { FluentConfluxProvider } from '@cfx-kit/react-utils/dist/AccountManagePlugins';

export const DEFAULT_WALLET_NAME = FluentConfluxProvider.walletName;

const allProviders = [FluentConfluxProvider] as const;

export const initProviders = () => {
  allProviders.forEach(provider => {
    registerWallet(provider);
  });
};
