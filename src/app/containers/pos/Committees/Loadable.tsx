/**
 * Asynchronously loads the component for Blocks
 */

import { lazyLoad } from 'utils/loadable';

export const Committees = lazyLoad(
  () => import('./index'),
  module => module.Committees,
);

export const CommitteesList = lazyLoad(
  () => import('./index'),
  module => module.List,
);
