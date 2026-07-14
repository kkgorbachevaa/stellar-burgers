import ingredientsReducer, { fetchIngredients } from '../ingredientsSlice';
import { TIngredient } from '@utils-types';

const mockIngredients: TIngredient[] = [
  {
    _id: '1',
    name: 'Тестовая краторная булка',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: 'bun.png',
    image_large: 'bun-large.png',
    image_mobile: 'bun-mobile.png'
  },
  {
    _id: '2',
    name: 'Тестовая биокотлета',
    type: 'main',
    proteins: 420,
    fat: 142,
    carbohydrates: 242,
    calories: 4242,
    price: 424,
    image: 'main.png',
    image_large: 'main-large.png',
    image_mobile: 'main-mobile.png'
  }
];

const initialState = {
  ingredients: [],
  isLoading: false,
  error: null
};

describe('ingredientsSlice reducer', () => {
  test('возвращает начальное состояние при неизвестном экшене', () => {
    const state = ingredientsReducer(undefined, { type: 'UNKNOWN' });

    expect(state).toEqual(initialState);
  });

  test('устанавливает состояние загрузки при fetchIngredients.pending', () => {
    const state = ingredientsReducer(
      initialState,
      fetchIngredients.pending('requestId', undefined)
    );

    expect(state).toEqual({
      ingredients: [],
      isLoading: true,
      error: null
    });
  });

  test('сохраняет ингредиенты при fetchIngredients.fulfilled', () => {
    const state = ingredientsReducer(
      {
        ingredients: [],
        isLoading: true,
        error: null
      },
      fetchIngredients.fulfilled(mockIngredients, 'requestId', undefined)
    );

    expect(state).toEqual({
      ingredients: mockIngredients,
      isLoading: false,
      error: null
    });
  });

  test('сохраняет ошибку при fetchIngredients.rejected', () => {
    const state = ingredientsReducer(
      {
        ingredients: [],
        isLoading: true,
        error: null
      },
      fetchIngredients.rejected(
        new Error('Ошибка сервера'),
        'requestId',
        undefined
      )
    );

    expect(state).toEqual({
      ingredients: [],
      isLoading: false,
      error: 'Ошибка сервера'
    });
  });
});
