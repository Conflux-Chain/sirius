/**
 * Asynchronously loads the component for Sponsor
 */

import { lazyLoad } from 'utils/loadable';

export const Sponsor = lazyLoad(
  () => import('./index'),
  module => module.Sponsor,
);
