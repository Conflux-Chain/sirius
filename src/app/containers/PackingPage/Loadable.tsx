/**
 * Asynchronously loads the component for PackingPage
 */

import { lazyLoad } from 'utils/loadable';

export const PackingPage = lazyLoad(
  () => import('./index'),
  module => module.PackingPage,
);
