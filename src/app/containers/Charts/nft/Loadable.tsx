import { lazyLoad } from 'utils/loadable';

export const Chart = lazyLoad(
  () => import('./index'),
  module => module.Chart,
);

export const Assets = lazyLoad(
  () => import('./Assets'),
  module => module.Assets,
);

export const DailyCFXTransferCount = lazyLoad(
  () => import('./DailyCFXTransferCount'),
  module => module.DailyCFXTransferCount,
);
