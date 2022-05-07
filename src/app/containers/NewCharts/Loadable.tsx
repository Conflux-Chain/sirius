import { lazyLoad } from 'utils/loadable';

export const BlockTime = lazyLoad(
  () => import('./BlockTime'),
  module => module.BlockTime,
);

export const HashRate = lazyLoad(
  () => import('./HashRate'),
  module => module.HashRate,
);
