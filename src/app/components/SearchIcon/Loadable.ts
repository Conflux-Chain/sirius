import { lazyLoad } from 'utils/loadable';

export const SearchIcon = lazyLoad(
  () => import('./index'),
  module => module.SearchIcon,
);
