/**
 * Asynchronously loads the component for NFTChecker
 */

import { lazyLoad } from 'utils/loadable';

export const NFTAsset = lazyLoad(
  () => import('./index'),
  module => module.NFTAsset,
);
