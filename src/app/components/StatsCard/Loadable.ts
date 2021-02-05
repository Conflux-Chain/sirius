import { lazyLoad } from 'utils/loadable';

export const StatsCard = lazyLoad(
  () => import('./index'),
  module => module.StatsCard,
);
