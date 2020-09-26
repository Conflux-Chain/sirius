/**
 *
 * Asynchronously loads the component for PageHeader
 *
 */

import { lazyLoad } from 'utils/loadable';

export const Footer = lazyLoad(
  () => import('./index'),
  module => module.default,
);
