/**
 * Asynchronously loads the component for Blocks
 */

import { lazyLoad } from 'utils/loadable';

export const Blocks = lazyLoad(
  () => import('./index'),
  module => module.Blocks,
);

export const BlocksList = lazyLoad(
  () => import('./index'),
  module => module.List,
);
