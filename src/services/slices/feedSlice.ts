import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getFeedsApi, getOrderByNumberApi } from '@api';
import { TOrder, TOrdersData } from '@utils-types';

type TFeedState = TOrdersData & {
  isLoading: boolean;
  error: string | null;
  currentOrder: TOrder | null;
  currentOrderLoading: boolean;
  currentOrderError: string | null;
};

const initialState: TFeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isLoading: false,
  error: null,
  currentOrder: null,
  currentOrderLoading: false,
  currentOrderError: null
};

export const fetchFeed = createAsyncThunk<TOrdersData>(
  'feed/fetchFeed',
  async () => getFeedsApi()
);

export const fetchOrderByNumber = createAsyncThunk<TOrder, number>(
  'feed/fetchOrderByNumber',
  async (number) => {
    const data = await getOrderByNumberApi(number);
    const order = data.orders[0];

    if (!order) {
      throw new Error('Заказ не найден');
    }

    return order;
  }
);

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeed.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFeed.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(fetchFeed.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка загрузки ленты заказов';
      })
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.currentOrderLoading = true;
        state.currentOrderError = null;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.currentOrderLoading = false;
        state.currentOrder = action.payload;
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.currentOrderLoading = false;
        state.currentOrderError =
          action.error.message || 'Ошибка загрузки заказа';
      });
  }
});

export default feedSlice.reducer;
