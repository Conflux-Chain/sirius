/**
 * Asynchronously loads the component for Contracts
 */

import { lazyLoad } from 'utils/loadable';

export const Contracts = lazyLoad(
  () => import('./index'),
  module => module.Contracts,
);
