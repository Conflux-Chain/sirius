/**
 *
 * Asynchronously loads the component for Empty
 *
 */

import { lazyLoad } from 'utils/loadable';

export const Empty = lazyLoad(
  () => import('./index'),
  module => module.Empty,
);
