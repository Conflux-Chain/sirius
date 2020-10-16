import { lazyLoad } from 'utils/loadable';

export const Tooltip = lazyLoad(
  () => import('./index'),
  module => module.Tooltip,
);
