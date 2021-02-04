/**
 * Asynchronously loads the component for Accounts
 */

import { lazyLoad } from 'utils/loadable';

export const Accounts = lazyLoad(
  () => import('./index'),
  module => module.Accounts,
);
