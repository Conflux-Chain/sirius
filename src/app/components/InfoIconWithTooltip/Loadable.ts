/**
 *
 * Asynchronously loads the component for InfoIconWithTooltip
 *
 */

import { lazyLoad } from 'utils/loadable';

export const InfoIconWithTooltip = lazyLoad(
  () => import('./index'),
  module => module.InfoIconWithTooltip,
);
