/**
 * Asynchronously loads the component for ABIVerification Update
 */

import { lazyLoad } from 'utils/loadable';

export const ABIVerification = lazyLoad(
  () => import('./index'),
  module => module.ABIVerification,
);
