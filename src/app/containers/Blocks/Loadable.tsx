/**
 * Asynchronously loads the component for Blocks
 */

import { lazyLoad } from 'utils/loadable';

export const Blocks = lazyLoad(
  () => import('./index'),
  module => module.Blocks,
);

export const Dag = lazyLoad(
  () => import('./Dag'),
  module => module.Dag,
);

export const MinedBlocks = lazyLoad(
  () => import('./MinedBlocks'),
  module => module.MinedBlocks,
);
