import { lazyLoad } from 'utils/loadable';

export const Chart = lazyLoad(
  () => import('./index'),
  module => module.Chart,
);

export const Assets = lazyLoad(
  () => import('./Assets'),
  module => module.Assets,
);

export const Holders = lazyLoad(
  () => import('./Holders'),
  module => module.Holders,
);

export const Contracts = lazyLoad(
  () => import('./Contracts'),
  module => module.Contracts,
);

export const Transfers = lazyLoad(
  () => import('./Transfers'),
  module => module.Transfers,
);
