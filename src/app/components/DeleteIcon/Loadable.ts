import { lazyLoad } from 'utils/loadable';

export const DeleteIcon = lazyLoad(
  () => import('./index'),
  module => module.DeleteIcon,
);
