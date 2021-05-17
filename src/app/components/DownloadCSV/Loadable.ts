/**
 *
 * Asynchronously loads the component for DownloadCSV
 *
 */

import { lazyLoad } from 'utils/loadable';

export const DownloadCSV = lazyLoad(
  () => import('./index'),
  module => module.DownloadCSV,
);
