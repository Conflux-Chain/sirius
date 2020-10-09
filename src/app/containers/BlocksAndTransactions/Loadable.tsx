/**
 * Asynchronously loads the component for BlocksAndTransactions
 */

import { lazyLoad } from 'utils/loadable';

export const BlocksAndTransactions = lazyLoad(
  () => import('./index'),
  module => module.BlocksAndTransactions,
);
