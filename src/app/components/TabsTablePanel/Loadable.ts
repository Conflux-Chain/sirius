/**
 *
 * Asynchronously loads the component for TablePanel
 *
 */

import { lazyLoad } from 'utils/loadable';

export const TablePanel = lazyLoad(
  () => import('./index'),
  module => module.default,
);

export const TabLabel = lazyLoad(
  () => import('./Label'),
  module => module.TabLabel,
);

export const TipLabel = lazyLoad(
  () => import('./Label'),
  module => module.TipLabel,
);
