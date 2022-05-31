import { lazyLoad } from 'utils/loadable';

export const Chart = lazyLoad(
  () => import('./index'),
  module => module.Chart,
);

export const TotalSupply = lazyLoad(
  () => import('./TotalSupply'),
  module => module.TotalSupply,
);

export const Contracts = lazyLoad(
  () => import('./Contracts'),
  module => module.Contracts,
);
