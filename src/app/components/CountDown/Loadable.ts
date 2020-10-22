/**
 *
 * Asynchronously loads the component for Description
 *
 */

import { lazyLoad } from 'utils/loadable';

export const CountDown = lazyLoad(
  () => import('./index'),
  module => module.CountDown,
);
