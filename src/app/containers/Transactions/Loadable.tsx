/**
 * Asynchronously loads the component for Transactions
 */

import { lazyLoad } from 'utils/loadable';

export const Transactions = lazyLoad(
  () => import('./index'),
  module => module.Transactions,
);

export const PendingTxns = lazyLoad(
  () => import('./PendingTxns'),
  module => module.PendingTxns,
);

export const InternalTxns = lazyLoad(
  () => import('./InternalTxns'),
  module => module.InternalTxns,
);
