/**
 *
 * Asynchronously loads the component for ConnectWallet
 *
 */

import { lazyLoad } from 'utils/loadable';

export const ConnectWallet = lazyLoad(
  () => import('./index'),
  module => module.ConnectWallet,
);
