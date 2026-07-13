import type { RootState } from '../store';

export const selectFeedOrders = (state: RootState) => state.feed.orders;

export const selectFeed = (state: RootState) => state.feed;

export const selectFeedLoading = (state: RootState) => state.feed.isLoading;

export const selectFeedError = (state: RootState) => state.feed.error;

export const selectOrderByNumber = (number: number) => (state: RootState) =>
  state.feed.orders.find((order) => order.number === number) ||
  (state.feed.currentOrder?.number === number
    ? state.feed.currentOrder
    : undefined);

export const selectCurrentOrderLoading = (state: RootState) =>
  state.feed.currentOrderLoading;

export const selectCurrentOrderError = (state: RootState) =>
  state.feed.currentOrderError;
