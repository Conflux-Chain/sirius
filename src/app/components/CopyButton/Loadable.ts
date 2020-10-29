/**
 *
 * Asynchronously loads the component for CopyButton
 *
 */

import { lazyLoad } from 'utils/loadable';

export const CopyButton = lazyLoad(
  () => import('./index'),
  module => module.CopyButton,
);
