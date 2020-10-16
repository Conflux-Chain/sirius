/**
 *
 * Asynchronously loads the component for TablePanel
 *
 */

import { lazyLoad } from 'utils/loadable';

export const TabsTablePanel = lazyLoad(
  () => import('./index'),
  module => module.TabsTablePanel,
);

export const TabLabel = lazyLoad(
  () => import('./Label'),
  module => module.TabLabel,
);

export const TipLabel = lazyLoad(
  () => import('./Label'),
  module => module.TipLabel,
);
