/**
 * Asynchronously loads the component for PoS Block
 */

import { lazyLoad } from 'utils/loadable';

export const Block = lazyLoad(
  () => import('./index'),
  module => module.Block,
);
