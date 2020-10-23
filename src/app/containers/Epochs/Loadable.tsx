/**
 * Asynchronously loads the component for Epochs
 */

import { lazyLoad } from 'utils/loadable';

export const Epochs = lazyLoad(
  () => import('./index'),
  module => module.Epochs,
);
