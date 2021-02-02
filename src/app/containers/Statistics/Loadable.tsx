/**
 * Asynchronously loads the component for Statistics
 */

import { lazyLoad } from 'utils/loadable';

export const Statistics = lazyLoad(
  () => import('./index'),
  module => module.Statistics,
);
