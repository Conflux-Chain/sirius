import { getCurrency, DEFAULT_NETWORK_IDS } from 'utils/constants';
import { createGlobalState } from 'react-use';

// react-use version, to solve useContext can not update global value in App.ts
export interface ContractsType {
  [index: string]: string;
  announcement: string;
  faucet: string;
  faucetLast: string;
  wcfx: string;
  governance: string;
}

export interface NetworksType {
  name: string;
  id: number;
}

export interface ENSType {
  [index: string]: {
    name: string;
    expired: number;
    delayed: number;
  };
}

export interface GlobalDataType {
  networks: Array<NetworksType>;
  networkId: number;
  contracts: ContractsType;
  currency?: Object;
  ens: ENSType;
}

// @todo, if no default global data, homepage should loading until getProjectConfig return resp
export const useGlobalData = createGlobalState<any>({
  networks: [
    {
      name: 'Conflux Hydra',
      id: 1029,
    },
    {
      name: 'Conflux Core (Testnet)',
      id: 1,
    },
  ],
  networkId: DEFAULT_NETWORK_IDS.mainnet,
  contracts: {},
  currency: getCurrency(),
  ens: {},
});

export const useGlobalENS = createGlobalState<any>(() => ({}));
