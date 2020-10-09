import { useLocation } from 'react-use';

export const useTestnet = () => {
  const location = useLocation();
  if (location && location.hostname && location.hostname.includes('testnet'))
    return true;
  return false;
};

const isTestEnv = () => window.location.hostname.includes('scantest');

export const toTestnet = () => {
  if (isTestEnv())
    return window.location.assign('//testnet.scantest.confluxscan.io');
  return window.location.assign('//testnet.confluxscan.io');
};
export const toMainnet = () => {
  if (isTestEnv()) return window.location.assign('//scantest.confluxscan.io');
  return window.location.assign('//confluxscan.io');
};
