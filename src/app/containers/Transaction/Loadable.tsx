/**
 * Asynchronously loads the component for Transactions
 */

import { lazyLoad } from 'utils/loadable';

export const Transaction = lazyLoad(
  () => import('./index'),
  module => module.Transaction,
);
