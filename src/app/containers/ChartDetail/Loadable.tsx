import { lazyLoad } from 'utils/loadable';

export const ChartDetail = lazyLoad(
  () => import('./index'),
  module => module.ChartDetail,
);
