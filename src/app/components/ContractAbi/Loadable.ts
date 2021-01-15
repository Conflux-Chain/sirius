import { lazyLoad } from 'utils/loadable';

export const ContractAbi = lazyLoad(
  () => import('./index'),
  module => module.ContractAbi,
);
