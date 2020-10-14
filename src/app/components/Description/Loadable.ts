/**
 *
 * Asynchronously loads the component for Description
 *
 */

import { lazyLoad } from 'utils/loadable';

export const Description = lazyLoad(
  () => import('./index'),
  module => module.Description,
);
