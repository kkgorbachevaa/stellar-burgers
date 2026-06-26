import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import { orderBurgerApi } from '@api';
import { TConstructorIngredient, TIngredient, TOrder } from '@utils-types';

type TBurgerConstructorState = {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
  orderRequest: boolean;
  orderModalData: TOrder | null;
  orderError: string | null;
};

const initialState: TBurgerConstructorState = {
  bun: null,
  ingredients: [],
  orderRequest: false,
  orderModalData: null,
  orderError: null
};

type TMoveIngredientPayload = {
  index: number;
  direction: 'up' | 'down';
};

export const createOrder = createAsyncThunk<TOrder, string[]>(
  'burgerConstructor/createOrder',
  async (ingredients) => {
    const data = await orderBurgerApi(ingredients);

    return {
      _id: data.order._id,
      status: data.order.status,
      name: data.order.name,
      createdAt: data.order.createdAt,
      updatedAt: data.order.updatedAt,
      number: data.order.number,
      ingredients
    };
  }
);

const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addIngredient: (state, action: PayloadAction<TIngredient>) => {
      const ingredient = {
        ...action.payload,
        id: uuidv4()
      };

      if (ingredient.type === 'bun') {
        state.bun = ingredient;
      } else {
        state.ingredients.push(ingredient);
      }
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter(
        (ingredient) => ingredient.id !== action.payload
      );
    },
    moveIngredient: (state, action: PayloadAction<TMoveIngredientPayload>) => {
      const { index, direction } = action.payload;
      const targetIndex = direction === 'up' ? index - 1 : index + 1;

      if (targetIndex < 0 || targetIndex >= state.ingredients.length) {
        return;
      }

      const currentIngredient = state.ingredients[index];

      state.ingredients[index] = state.ingredients[targetIndex];
      state.ingredients[targetIndex] = currentIngredient;
    },
    clearOrderModalData: (state) => {
      state.orderModalData = null;
      state.orderError = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.orderError = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload;
        state.bun = null;
        state.ingredients = [];
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.orderError = action.error.message || 'Ошибка оформления заказа';
      });
  }
});

export const {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearOrderModalData
} = burgerConstructorSlice.actions;

export default burgerConstructorSlice.reducer;
