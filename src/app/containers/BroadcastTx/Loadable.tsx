/**
 * Asynchronously loads the component for BroadcastTx
 */

import { lazyLoad } from 'utils/loadable';

export const BroadcastTx = lazyLoad(
  () => import('./index'),
  module => module.BroadcastTx,
);
