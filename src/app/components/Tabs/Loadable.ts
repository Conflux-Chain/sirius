import { lazyLoad } from 'utils/loadable';

const TabsComponent = lazyLoad(
  () => import('./index'),
  module => module.default,
);

export default TabsComponent;
