/**
 *
 * Asynchronously loads the component for Security
 *
 */

import { lazyLoad } from 'utils/loadable';

export const Security = lazyLoad(
  () => import('./index'),
  module => module.Security,
);
