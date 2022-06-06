/**
 * Asynchronously loads the component for Blocks
 */

import { lazyLoad } from 'utils/loadable';

export const Accounts = lazyLoad(
  () => import('./index'),
  module => module.Accounts,
);

export const AccountsList = lazyLoad(
  () => import('./index'),
  module => module.List,
);
