import { lazyLoad } from 'utils/loadable';

export const Chart = lazyLoad(
  () => import('./index.jsx'),
  module => module.Charts,
);
