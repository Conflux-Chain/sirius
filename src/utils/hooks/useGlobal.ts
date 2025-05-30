import { NETWORK_OPTIONS, getCurrency } from 'utils/constants';
import { createGlobalState } from 'react-use';
import ENV_CONFIG from 'env';
import { useGlobalData as useGlobalDataNext } from '@cfxjs/sirius-next-common/dist/store/index';
import { GlobalDataType } from '@cfxjs/sirius-next-common/dist/store/types';

// react-use version, to solve useContext can not update global value in App.ts
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
