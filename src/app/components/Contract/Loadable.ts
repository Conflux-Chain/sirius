/**
 *
 * Asynchronously loads the component for Contract
 *
 */

import { lazyLoad } from 'utils/loadable';

export const Contract = lazyLoad(
  () => import('./index'),
  module => module.Contract,
);
