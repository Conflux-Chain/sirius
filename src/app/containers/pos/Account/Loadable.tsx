/**
 * Asynchronously loads the component for PoS Account
 */

import { lazyLoad } from 'utils/loadable';

export const Account = lazyLoad(
  () => import('./index'),
  module => module.Account,
);
