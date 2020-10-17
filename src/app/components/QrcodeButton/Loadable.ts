/**
 *
 * Asynchronously loads the component for QrcodeButton
 *
 */

import { lazyLoad } from 'utils/loadable';

export const QrcodeButton = lazyLoad(
  () => import('./index'),
  module => module.QrcodeButton,
);
