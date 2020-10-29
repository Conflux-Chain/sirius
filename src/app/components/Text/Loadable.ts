import { lazyLoad } from 'utils/loadable';

export const Text = lazyLoad(
  () => import('./index'),
  module => module.Text,
);
