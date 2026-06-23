import { NETWORK_OPTIONS } from 'utils/constants';
import { createGlobalState } from 'react-use';
import ENV_CONFIG from 'env';
import { useGlobalData as useGlobalDataNext } from '@cfxjs/sirius-next-common/dist/store/index';
import { GlobalDataType } from '@cfxjs/sirius-next-common/dist/store/types';

// react-use version, to solve useContext can not update global value in App.ts
const defaultGlobalData: GlobalDataType = {
  networks: NETWORK_OPTIONS,
  networkId: ENV_CONFIG.ENV_NETWORK_ID,
  contracts: {},
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
