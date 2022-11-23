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
