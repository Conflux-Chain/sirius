/**
 *
 * Asynchronously loads the component for Contract
 *
 */

import { lazyLoad } from 'utils/loadable';

export const ContractOrTokenInfo = lazyLoad(
  () => import('./index'),
  module => module.ContractOrTokenInfo,
);

export const Contract = lazyLoad(
  () => import('./index.bak'),
  module => module.Contract,
);
