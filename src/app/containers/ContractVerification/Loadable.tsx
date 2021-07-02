/**
 * Asynchronously loads the component for ContractVerification Update
 */

import { lazyLoad } from 'utils/loadable';

export const ContractVerification = lazyLoad(
  () => import('./index'),
  module => module.ContractVerification,
);
