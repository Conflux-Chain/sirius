import { lazyLoad } from 'utils/loadable';

export const Chart = lazyLoad(
  () => import('./index'),
  module => module.Chart,
);

export const SmallChart = lazyLoad(
  () => import('./index'),
  module => module.SmallChart,
);
