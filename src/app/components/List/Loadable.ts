/**
 *
 * Asynchronously loads the component for List
 *
 */

import { lazyLoad } from 'utils/loadable';

export const List = lazyLoad(
  () => import('./index'),
  module => module.List,
);
