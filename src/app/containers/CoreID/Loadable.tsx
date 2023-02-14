/**
 * Asynchronously loads the component for NFTChecker
 */

import { lazyLoad } from 'utils/loadable';

export const CoreID = lazyLoad(
  () => import('./index'),
  module => module.CoreID,
);
