/**
 * Asynchronously loads the component for NotFoundPage
 */

import { lazyLoad } from 'utils/loadable';

export const NotFoundContractPage = lazyLoad(
  () => import('./index'),
  module => module.NotFoundContractPage,
);
