/**
 * Asynchronously loads the component for Swap
 */

import { lazyLoad } from 'utils/loadable';

export const Swap = lazyLoad(
  () => import('./index'),
  module => module.Swap,
);
