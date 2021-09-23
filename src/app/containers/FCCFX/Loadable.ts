/**
 *
 * Asynchronously loads the component for FCCFX
 *
 */

import { lazyLoad } from 'utils/loadable';

export const FCCFX = lazyLoad(
  () => import('./index'),
  module => module.FCCFX,
);
