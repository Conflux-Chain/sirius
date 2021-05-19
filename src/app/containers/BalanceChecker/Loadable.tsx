/**
 * Asynchronously loads the component for AddressConverter
 */

import { lazyLoad } from 'utils/loadable';

export const BalanceChecker = lazyLoad(
  () => import('./index'),
  module => module.BalanceChecker,
);
