/**
 * Asynchronously loads the component for Epochs
 */

import { lazyLoad } from 'utils/loadable';

export const Epoch = lazyLoad(
  () => import('./index'),
  module => module.Epoch,
);
