import type { RootState } from '../store';

export const selectProfileOrders = (state: RootState) =>
  state.profileOrders.orders;

export const selectProfileOrdersLoading = (state: RootState) =>
  state.profileOrders.isLoading;

export const selectProfileOrdersError = (state: RootState) =>
  state.profileOrders.error;
