import { NETWORK_OPTIONS, getCurrency } from 'utils/constants';
import { createGlobalState } from 'react-use';
import ENV_CONFIG from 'env';
import { LOCALSTORAGE_KEYS_MAP } from 'utils/enum';
import { useGlobalData as useGlobalDataNext } from 'sirius-next/packages/common/dist/store/index';

// react-use version, to solve useContext can not update global value in App.ts
export interface ContractsType {
  [index: string]: string | undefined;
  announcement?: string;
  faucet?: string;
  faucetLast?: string;
  wcfx?: string;
  governance?: string;
}

export interface NetworksType {
  url: string;
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
  currency?: string;
  ens: ENSType;
  random?: number;
  [LOCALSTORAGE_KEYS_MAP.addressLabel]?: Record<string, string>;
  [LOCALSTORAGE_KEYS_MAP.txPrivateNote]?: Record<string, string>;
}

const defaultGlobalData: GlobalDataType = {
  networks: NETWORK_OPTIONS,
  networkId: ENV_CONFIG.ENV_NETWORK_ID,
  contracts: {},
  currency: getCurrency(),
  ens: {},
};
// @todo, if no default global data, homepage should loading until getProjectConfig return resp
const _useGlobalData = createGlobalState(defaultGlobalData);
export const useGlobalData = () => {
  const [globalData, setGlobalDataOriginal] = _useGlobalData();
  const { setGlobalData: setGlobalDataNext } = useGlobalDataNext();
  const setGlobalData = newData => {
    setGlobalDataOriginal(newData);
    setGlobalDataNext(newData);
  };
  return [globalData || defaultGlobalData, setGlobalData] as const;
};

export interface GasPriceBundle {
  gasPriceInfo: {
    min: number;
    tp50: number;
    max: number;
  };
  gasPriceMarket: {
    min: number;
    tp25: number;
    tp50: number;
    tp75: number;
    max: number;
  };
  maxEpoch: number;
  minEpoch: number;
  maxTime: string;
  minTime: string;
  blockHeight: number;
}
export const defaultGasPriceBundle: GasPriceBundle = {
  gasPriceInfo: {
    min: 0,
    tp50: 0,
    max: 0,
  },
  gasPriceMarket: {
    min: 0,
    tp25: 0,
    tp50: 0,
    tp75: 0,
    max: 0,
  },
  maxEpoch: 0,
  minEpoch: 0,
  maxTime: '0',
  minTime: '0',
  blockHeight: 0,
};
export const useGasPrice = createGlobalState<GasPriceBundle>(
  defaultGasPriceBundle,
);
