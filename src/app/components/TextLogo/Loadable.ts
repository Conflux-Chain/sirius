/**
 *
 * Asynchronously loads the component for TextLogo
 *
 */

import { lazyLoad } from 'utils/loadable';

export const TextLogo = lazyLoad(
  () => import('./index'),
  module => module.TextLogo,
);
