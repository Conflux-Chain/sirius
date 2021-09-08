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
