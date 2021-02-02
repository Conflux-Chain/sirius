import { lazyLoad } from 'utils/loadable';

export const Card = lazyLoad(
  () => import('./index'),
  module => module.AddressContainer,
);
