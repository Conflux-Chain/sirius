/**
 *
 * Asynchronously loads the component for Dropdown
 *
 */

import { lazyLoad } from 'utils/loadable';

export const Dropdown = lazyLoad(
  () => import('./index'),
  module => module.Dropdown,
);
