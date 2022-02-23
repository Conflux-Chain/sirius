/**
 * Asynchronously loads the component for PoS Committee
 */

import { lazyLoad } from 'utils/loadable';

export const Committee = lazyLoad(
  () => import('./index'),
  module => module.Committee,
);
