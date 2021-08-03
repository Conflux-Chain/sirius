/**
 * Asynchronously loads the component for NFTChecker
 */

import { lazyLoad } from 'utils/loadable';

export const NFTChecker = lazyLoad(
  () => import('./index'),
  module => module.NFTChecker,
);
