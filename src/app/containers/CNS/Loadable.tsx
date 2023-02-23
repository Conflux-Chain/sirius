/**
 * Asynchronously loads the component for NFTChecker
 */

import { lazyLoad } from 'utils/loadable';

export const CNS = lazyLoad(
  () => import('./index'),
  module => module.CNS,
);
