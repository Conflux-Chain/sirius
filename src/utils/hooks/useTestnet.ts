import { useLocation } from 'react-use';

export const useTestnet = () => {
  const location = useLocation();
  if (location && location.hostname && location.hostname.includes('testnet'))
    return true;
  return process.env.REACT_APP_TestNet === 'true';
};

const isTestEnv = () => window.location.hostname.includes('scantest');
export const isTestNetEnv = () =>
  process.env.REACT_APP_TestNet === 'true' ||
  window.location.hostname.includes('testnet');
export const toTestnet = () => {
  if (isTestEnv())
    return window.location.assign('//testnet-scantest.confluxnetwork.org');
  return window.location.assign('//testnet.confluxscan.io');
};
export const toMainnet = () => {
  if (isTestEnv())
    return window.location.assign('//scantest.confluxnetwork.org');
  return window.location.assign('//confluxscan.io');
};
