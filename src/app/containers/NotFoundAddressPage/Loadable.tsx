/**
 * Asynchronously loads the component for NotFoundPage
 */

import { lazyLoad } from 'utils/loadable';

export const NotFoundAddressPage = lazyLoad(
  () => import('./index'),
  module => module.NotFoundAddressPage,
);
