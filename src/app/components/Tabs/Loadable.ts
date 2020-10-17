import { lazyLoad } from 'utils/loadable';

const Tabs = lazyLoad(
  () => import('./index'),
  module => module.Tabs,
);

// can't export Tabs.Item
export default Tabs;
