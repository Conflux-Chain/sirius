import { lazyLoad } from 'utils/loadable';

export const InputData = lazyLoad(
  () => import('./index'),
  module => module.InputData,
);
