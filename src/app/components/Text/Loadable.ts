import { lazyLoad } from 'utils/loadable';

const Text = lazyLoad(
  () => import('./index'),
  module => module.default,
);

export default Text;
