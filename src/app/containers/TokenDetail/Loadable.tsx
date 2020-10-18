/**
 * Asynchronously loads the component for Tokens
 */

import { lazyLoad } from 'utils/loadable';

export const TokenDetail = lazyLoad(
  () => import('./index'),
  module => module.TokenDetail,
);
