/**
 *
 * Asynchronously loads the component for NFTPreview
 *
 */

import { lazyLoad } from 'utils/loadable';

export const NFTPreview = lazyLoad(
  () => import('./index'),
  module => module.NFTPreview,
);
