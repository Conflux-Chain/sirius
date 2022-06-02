import { lazyLoad } from 'utils/loadable';

export const Chart = lazyLoad(
  () => import('./index'),
  module => module.Chart,
);

export const DailyAccounts = lazyLoad(
  () => import('./DailyAccounts'),
  module => module.DailyAccounts,
);

export const Contract = lazyLoad(
  () => import('./Contract'),
  module => module.Contract,
);
