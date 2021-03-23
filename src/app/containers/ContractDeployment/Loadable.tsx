/**
 * Asynchronously loads the component for Contract Deploy
 */

import { lazyLoad } from 'utils/loadable';

export const ContractDeployment = lazyLoad(
  () => import('./index'),
  module => module.ContractDeployment,
);
