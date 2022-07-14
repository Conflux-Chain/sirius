/**
 * Asynchronously loads the component for Blocks
 */

import { lazyLoad } from 'utils/loadable';

export const IncomingRank = lazyLoad(
  () => import('./index'),
  module => module.IncomingRank,
);

export const IncomingRankList = lazyLoad(
  () => import('./IncomingRankList'),
  module => module.IncomingRankList,
);
