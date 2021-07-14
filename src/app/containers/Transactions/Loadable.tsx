/**
 * Asynchronously loads the component for Transactions
 */

import { lazyLoad } from 'utils/loadable';

export const Transactions = lazyLoad(
  () => import('./index'),
  module => module.Transactions,
);

export const PendingTxns = lazyLoad(
  () => import('./PendingTxns'),
  module => module.PendingTxns,
);

export const InternalTxns = lazyLoad(
  () => import('./InternalTxns'),
  module => module.InternalTxns,
);

export const ExcutedTxns = lazyLoad(
  () => import('./ExcutedTxns'),
  module => module.ExcutedTxns,
);

export const CFXTxns = lazyLoad(
  () => import('./CFXTxns'),
  module => module.CFXTxns,
);

export const CRC20Txns = lazyLoad(
  () => import('./CRC20Txns'),
  module => module.CRC20Txns,
);

export const CRC721Txns = lazyLoad(
  () => import('./CRC721Txns'),
  module => module.CRC721Txns,
);

export const CRC1155Txns = lazyLoad(
  () => import('./CRC1155Txns'),
  module => module.CRC1155Txns,
);
