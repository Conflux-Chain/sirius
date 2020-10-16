import { lazyLoad } from 'utils/loadable';

const TabsComponent = lazyLoad(
  () => import('./index'),
  module => module.Tabs,
);

export default TabsComponent;
