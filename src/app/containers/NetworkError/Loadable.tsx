/**
 * Asynchronously loads the component for NetworkError
 */

import { lazyLoad } from 'utils/loadable';

export const NetworkError = lazyLoad(
  () => import('./index'),
  module => module.NetworkError,
);
