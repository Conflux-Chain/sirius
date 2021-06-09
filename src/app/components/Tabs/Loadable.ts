import { lazyLoad } from 'utils/loadable';

const Tabs = lazyLoad(
  () => import('./index'),
  module => module.Tabs,
);

const SubTabs = lazyLoad(
  () => import('./SubTabsComponent'),
  module => module.SubTabs,
);

// can't export Tabs.Item
export default Tabs;
export { SubTabs };
