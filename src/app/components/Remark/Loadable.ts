/**
 *
 * Asynchronously loads the component for Remark
 *
 */

import { lazyLoad } from 'utils/loadable';

export const Remark = lazyLoad(
  () => import('./index'),
  module => module.Remark,
);
