import { lazyLoad } from 'utils/loadable';

export const Chart = lazyLoad(
  () => import('./index'),
  module => module.Chart,
);

export const CumulativeCFXBurn = lazyLoad(
  () => import('./CumulativeCFXBurn'),
  module => module.CumulativeCFXBurn,
);
