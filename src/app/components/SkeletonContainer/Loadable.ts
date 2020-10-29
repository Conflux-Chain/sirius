import { lazyLoad } from 'utils/loadable';

const SkeletonContainer = lazyLoad(
  () => import('./index'),
  module => module.default,
);

export default SkeletonContainer;
