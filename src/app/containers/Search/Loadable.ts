/**
 *
 * Asynchronously loads the component for Search
 *
 */

import { lazyLoad } from 'utils/loadable';

export const Search = lazyLoad(
  () => import('./index'),
  module => module.Search,
);
