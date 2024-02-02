import create from 'zustand';

export const useENSStore = create(set => ({
  ens: {},
  setENS: newENS =>
    set(state => ({
      ens: {
        ...state.ens,
        ...newENS,
      },
    })),
}));

export const useNametagCacheStore = create(set => ({
  nametagCache: {},
  contractCache: {},
  setNametagCache: e =>
    set(state => ({
      nametagCache: {
        ...state.nametagCache,
        ...e,
      },
    })),
  setContractCache: e =>
    set(state => ({
      contractCache: {
        ...state.contractCache,
        ...e,
      },
    })),
}));
