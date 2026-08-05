/**
 * Asynchronously loads the component for VerifiedContracts
 */

import { lazyLoad } from 'utils/loadable';

export const VerifiedContracts = lazyLoad(
  () => import('./index'),
  module => module.VerifiedContracts,
);
