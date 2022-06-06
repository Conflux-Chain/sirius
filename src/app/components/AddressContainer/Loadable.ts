import { lazyLoad } from 'utils/loadable';

export const AddressContainer = lazyLoad(
  () => import('./index'),
  module => module.AddressContainer,
);

export const PoSAddressContainer = lazyLoad(
  () => import('./index'),
  module => module.PoSAddressContainer,
);
