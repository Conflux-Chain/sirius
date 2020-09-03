import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './slice';

const selectDomain = (state: RootState) => state.header || initialState;

export const selectHeader = createSelector(
  [selectDomain],
  headerState => headerState,
);
