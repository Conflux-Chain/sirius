/**
 *
 * Asynchronously loads the component for TablePanel
 *
 */

import { lazyLoad } from 'utils/loadable';

export const TablePanel = lazyLoad(
  () => import('./index'),
  module => module.TablePanel,
);
