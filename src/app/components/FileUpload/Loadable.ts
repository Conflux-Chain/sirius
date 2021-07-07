/**
 *
 * Asynchronously loads the component for FileUpload
 *
 */

import { lazyLoad } from 'utils/loadable';

export const FileUpload = lazyLoad(
  () => import('./index'),
  module => module.FileUpload,
);
