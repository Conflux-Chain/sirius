/**
 *
 * Asynchronously loads the component for JSONFileUpload
 *
 */

import { lazyLoad } from 'utils/loadable';

export const JSONFileUpload = lazyLoad(
  () => import('./index'),
  module => module.JSONFileUpload,
);
