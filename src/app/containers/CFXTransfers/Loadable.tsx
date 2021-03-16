/**
 * Asynchronously loads the component for CFXTransfers
 */

import { lazyLoad } from 'utils/loadable';

export const CFXTransfers = lazyLoad(
  () => import('./index'),
  module => module.CFXTransfers,
);
