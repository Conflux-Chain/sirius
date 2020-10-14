/**
 *
 * Asynchronously loads the component for ContractDetail
 *
 */

import { lazyLoad } from 'utils/loadable';

export const ContractDetail = lazyLoad(
  () => import('./ContractDetail'),
  module => module.ContractDetail,
);

export const AddressDetail = lazyLoad(
  () => import('./AddressDetail'),
  module => module.AddressDetail,
);

export const DetailPageCard = lazyLoad(
  () => import('./DetailPageCard'),
  module => module.DetailPageCard,
);
