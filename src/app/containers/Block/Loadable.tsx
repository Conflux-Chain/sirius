/**
 * Asynchronously loads the component for Blocks
 */

import { lazyLoad } from 'utils/loadable';

export const Block = lazyLoad(
  () => import('./index'),
  module => module.Block,
);
