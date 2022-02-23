/**
 * Asynchronously loads the component for PoS Transaction
 */

import { lazyLoad } from 'utils/loadable';

export const Transaction = lazyLoad(
  () => import('./index'),
  module => module.Transaction,
);
