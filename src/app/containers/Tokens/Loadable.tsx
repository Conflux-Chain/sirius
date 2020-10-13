/**
 * Asynchronously loads the component for Tokens
 */

import { lazyLoad } from 'utils/loadable';

export const Tokens = lazyLoad(
  () => import('./index'),
  module => module.Tokens,
);
