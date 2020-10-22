/**
 *
 * Asynchronously loads the component for ContractDetail
 *
 */

import { lazyLoad } from 'utils/loadable';

export const ContractDetailPage = lazyLoad(
  () => import('./ContractDetailPage'),
  module => module.ContractDetailPage,
);

export const AddressDetailPage = lazyLoad(
  () => import('./AddressDetailPage'),
  module => module.AddressDetailPage,
);

export const AddressContractDetailPage = lazyLoad(
  () => import('./AddressContractDetailPage'),
  module => module.AddressContractDetailPage,
);

export const DetailPageCard = lazyLoad(
  () => import('./DetailPageCard'),
  module => module.DetailPageCard,
);

export const Table = lazyLoad(
  () => import('./Table'),
  module => module.Table,
);

export const ContractMetadata = lazyLoad(
  () => import('./ContractMetadata'),
  module => module.ContractMetadata,
);
