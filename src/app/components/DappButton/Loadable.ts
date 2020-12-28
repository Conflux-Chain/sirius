import { lazyLoad } from './../../../utils/loadable';

export const DappButton = lazyLoad(
  () => import('./index'),
  module => module.default,
);
