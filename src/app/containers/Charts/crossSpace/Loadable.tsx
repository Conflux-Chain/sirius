import { lazyLoad } from 'utils/loadable';

export const Chart = lazyLoad(
  () => import('./index'),
  module => module.Chart,
);

export const DailyCFXTransfer = lazyLoad(
  () => import('./DailyCFXTransfer'),
  module => module.DailyCFXTransfer,
);

export const DailyCFXTransferCount = lazyLoad(
  () => import('./DailyCFXTransferCount'),
  module => module.DailyCFXTransferCount,
);
