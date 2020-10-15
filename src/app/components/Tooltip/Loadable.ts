import { lazyLoad } from 'utils/loadable';

const Tooltip = lazyLoad(
  () => import('./index'),
  module => module.default,
);

export default Tooltip;
