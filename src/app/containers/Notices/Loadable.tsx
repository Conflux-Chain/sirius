/**
 * Asynchronously loads the component for Notices
 */

import { lazyLoad } from 'utils/loadable';

export const Notices = lazyLoad(
  () => import('./index'),
  module => module.Notices,
);
