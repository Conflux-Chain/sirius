import { lazyLoad } from 'utils/loadable';

export const AddressContainer = lazyLoad(
  () => import('./index'),
  module => module.AddressContainer,
);
