import { lazyLoad } from 'utils/loadable';

export const NewChart = lazyLoad(
  () => import('./index'),
  module => module.NewChart,
);

export const BlockTime = lazyLoad(
  () => import('./BlockTime'),
  module => module.BlockTime,
);

export const TPS = lazyLoad(
  () => import('./TPS'),
  module => module.TPS,
);

export const HashRate = lazyLoad(
  () => import('./HashRate'),
  module => module.HashRate,
);

export const Difficulty = lazyLoad(
  () => import('./Difficulty'),
  module => module.Difficulty,
);

export const TotalSupply = lazyLoad(
  () => import('./TotalSupply'),
  module => module.TotalSupply,
);

export const CirculatingSupply = lazyLoad(
  () => import('./CirculatingSupply'),
  module => module.CirculatingSupply,
);

export const Tx = lazyLoad(
  () => import('./Tx'),
  module => module.Tx,
);

export const TokenTransfer = lazyLoad(
  () => import('./TokenTransfer'),
  module => module.TokenTransfer,
);

export const CFXTransfer = lazyLoad(
  () => import('./CFXTransfer'),
  module => module.CFXTransfer,
);

export const CFXHolderAccounts = lazyLoad(
  () => import('./CFXHolderAccounts'),
  module => module.CFXHolderAccounts,
);

export const AccountGrowth = lazyLoad(
  () => import('./AccountGrowth'),
  module => module.AccountGrowth,
);

export const ActiveAccounts = lazyLoad(
  () => import('./ActiveAccounts'),
  module => module.ActiveAccounts,
);

export const Contracts = lazyLoad(
  () => import('./Contracts'),
  module => module.Contracts,
);

export const Contract = lazyLoad(
  () => import('./Contract'),
  module => module.Contract,
);

export const Token = lazyLoad(
  () => import('./Token'),
  module => module.Token,
);
