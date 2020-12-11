/**
 *
 * Asynchronously loads the component for GlobalNotify
 *
 */

import { lazyLoad } from 'utils/loadable';

export const GlobalNotify = lazyLoad(
  () => import('./index'),
  module => module.GlobalNotify,
);
