/**
 * Asynchronously loads the component for Report
 */

import { lazyLoad } from 'utils/loadable';

export const Report = lazyLoad(
  () => import('./index'),
  module => module.Report,
);
