/**
 * Asynchronously loads the component for BlocknumberCalc
 */

import { lazyLoad } from 'utils/loadable';

export const BlocknumberCalc = lazyLoad(
  () => import('./index'),
  module => module.BlocknumberCalc,
);
