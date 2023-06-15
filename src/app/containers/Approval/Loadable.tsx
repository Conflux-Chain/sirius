import { lazyLoad } from 'utils/loadable';

export const Approval = lazyLoad(
  () => import('./index'),
  module => module.Approval,
);
