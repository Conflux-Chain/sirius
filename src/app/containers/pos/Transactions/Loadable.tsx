/**
 * Asynchronously loads the component for Blocks
 */

import { lazyLoad } from 'utils/loadable';

export const Transactions = lazyLoad(
  () => import('./index'),
  module => module.Transactions,
);

export const TransactionsList = lazyLoad(
  () => import('./index'),
  module => module.List,
);
