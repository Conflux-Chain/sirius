import { lazyLoad } from 'utils/loadable';

// can't export Select.Option
export const Select = lazyLoad(
  () => import('./index'),
  module => module.Select,
);
