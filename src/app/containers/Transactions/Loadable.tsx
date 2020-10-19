/**
 * Asynchronously loads the component for Transactions
 */

import { lazyLoad } from 'utils/loadable';

export const Transactions = lazyLoad(
  () => import('./index'),
  module => module.Transactions,
);
