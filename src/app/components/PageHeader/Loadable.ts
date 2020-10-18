/**
 *
 * Asynchronously loads the component for PageHeader
 *
 */

import { lazyLoad } from 'utils/loadable';

export const PageHeader = lazyLoad(
  () => import('./index'),
  module => module.PageHeader,
);
