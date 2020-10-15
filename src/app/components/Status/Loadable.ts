/**
 *
 * Asynchronously loads the component for Status
 *
 */

import { lazyLoad } from 'utils/loadable';

export const Status = lazyLoad(
  () => import('./index'),
  module => module.Status,
);
