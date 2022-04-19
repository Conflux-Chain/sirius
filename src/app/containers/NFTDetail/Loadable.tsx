/**
 * Asynchronously loads the component for NFTDetail Update
 */

import { lazyLoad } from 'utils/loadable';

export const NFTDetail = lazyLoad(
  () => import('./index'),
  module => module.NFTDetail,
);
