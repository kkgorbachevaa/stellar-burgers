import burgerConstructorReducer, {
  addIngredient,
  clearOrderModalData,
  createOrder,
  moveIngredient,
  removeIngredient
} from '../burgerConstructorSlice';
import { TConstructorIngredient, TIngredient, TOrder } from '@utils-types';

const mockBun: TIngredient = {
  _id: 'bun-1',
  name: 'Тестовая булка',
  type: 'bun',
  proteins: 10,
  fat: 20,
  carbohydrates: 30,
  calories: 40,
  price: 100,
  image: 'bun.png',
  image_large: 'bun-large.png',
  image_mobile: 'bun-mobile.png'
};

const mockMain: TIngredient = {
  _id: 'main-1',
  name: 'Тестовая начинка',
  type: 'main',
  proteins: 15,
  fat: 25,
  carbohydrates: 35,
  calories: 45,
  price: 200,
  image: 'main.png',
  image_large: 'main-large.png',
  image_mobile: 'main-mobile.png'
};

const mockSauce: TIngredient = {
  _id: 'sauce-1',
  name: 'Тестовый соус',
  type: 'sauce',
  proteins: 5,
  fat: 10,
  carbohydrates: 15,
  calories: 20,
  price: 50,
  image: 'sauce.png',
  image_large: 'sauce-large.png',
  image_mobile: 'sauce-mobile.png'
};

const mockConstructorMain: TConstructorIngredient = {
  ...mockMain,
  id: 'constructor-main-1'
};

const mockConstructorSauce: TConstructorIngredient = {
  ...mockSauce,
  id: 'constructor-sauce-1'
};

const mockOrder: TOrder = {
  _id: 'order-1',
  status: 'done',
  name: 'Тестовый бургер',
  createdAt: '2026-07-14T10:00:00.000Z',
  updatedAt: '2026-07-14T10:00:00.000Z',
  number: 12345,
  ingredients: ['bun-1', 'main-1', 'bun-1']
};

const initialState = {
  bun: null,
  ingredients: [],
  orderRequest: false,
  orderModalData: null,
  orderError: null
};

describe('burgerConstructorSlice reducer', () => {
  test('возвращает начальное состояние при неизвестном экшене', () => {
    const state = burgerConstructorReducer(undefined, { type: 'UNKNOWN' });

    expect(state).toEqual(initialState);
  });

  test('добавляет булку в конструктор', () => {
    const state = burgerConstructorReducer(
      initialState,
      addIngredient(mockBun)
    );

    expect(state.bun).toEqual({
      ...mockBun,
      id: expect.any(String)
    });
    expect(state.ingredients).toEqual([]);
  });

  test('заменяет булку, если добавить другую булку', () => {
    const firstState = burgerConstructorReducer(
      initialState,
      addIngredient(mockBun)
    );

    const anotherBun: TIngredient = {
      ...mockBun,
      _id: 'bun-2',
      name: 'Другая тестовая булка'
    };

    const state = burgerConstructorReducer(
      firstState,
      addIngredient(anotherBun)
    );

    expect(state.bun).toEqual({
      ...anotherBun,
      id: expect.any(String)
    });
    expect(state.ingredients).toEqual([]);
  });

  test('добавляет начинку в список ингредиентов конструктора', () => {
    const state = burgerConstructorReducer(
      initialState,
      addIngredient(mockMain)
    );

    expect(state.ingredients).toEqual([
      {
        ...mockMain,
        id: expect.any(String)
      }
    ]);
    expect(state.bun).toBeNull();
  });

  test('удаляет ингредиент из конструктора', () => {
    const stateWithIngredient = {
      ...initialState,
      ingredients: [mockConstructorMain]
    };

    const state = burgerConstructorReducer(
      stateWithIngredient,
      removeIngredient('constructor-main-1')
    );

    expect(state.ingredients).toEqual([]);
  });

  test('перемещает ингредиент вверх', () => {
    const stateWithIngredients = {
      ...initialState,
      ingredients: [mockConstructorMain, mockConstructorSauce]
    };

    const state = burgerConstructorReducer(
      stateWithIngredients,
      moveIngredient({ index: 1, direction: 'up' })
    );

    expect(state.ingredients).toEqual([
      mockConstructorSauce,
      mockConstructorMain
    ]);
  });

  test('перемещает ингредиент вниз', () => {
    const stateWithIngredients = {
      ...initialState,
      ingredients: [mockConstructorMain, mockConstructorSauce]
    };

    const state = burgerConstructorReducer(
      stateWithIngredients,
      moveIngredient({ index: 0, direction: 'down' })
    );

    expect(state.ingredients).toEqual([
      mockConstructorSauce,
      mockConstructorMain
    ]);
  });

  test('очищает данные модального окна заказа', () => {
    const stateWithOrder = {
      ...initialState,
      orderModalData: mockOrder,
      orderError: 'Ошибка'
    };

    const state = burgerConstructorReducer(
      stateWithOrder,
      clearOrderModalData()
    );

    expect(state.orderModalData).toBeNull();
    expect(state.orderError).toBeNull();
  });

  test('устанавливает состояние загрузки при createOrder.pending', () => {
    const state = burgerConstructorReducer(
      initialState,
      createOrder.pending('requestId', ['bun-1', 'main-1', 'bun-1'])
    );

    expect(state.orderRequest).toBe(true);
    expect(state.orderError).toBeNull();
  });

  test('сохраняет заказ и очищает конструктор при createOrder.fulfilled', () => {
    const stateWithBurger = {
      ...initialState,
      bun: {
        ...mockBun,
        id: 'constructor-bun-1'
      },
      ingredients: [mockConstructorMain],
      orderRequest: true
    };

    const state = burgerConstructorReducer(
      stateWithBurger,
      createOrder.fulfilled(mockOrder, 'requestId', [
        'bun-1',
        'main-1',
        'bun-1'
      ])
    );

    expect(state.orderRequest).toBe(false);
    expect(state.orderModalData).toEqual(mockOrder);
    expect(state.bun).toBeNull();
    expect(state.ingredients).toEqual([]);
  });

  test('сохраняет ошибку при createOrder.rejected', () => {
    const state = burgerConstructorReducer(
      {
        ...initialState,
        orderRequest: true
      },
      createOrder.rejected(new Error('Ошибка оформления заказа'), 'requestId', [
        'bun-1',
        'main-1',
        'bun-1'
      ])
    );

    expect(state.orderRequest).toBe(false);
    expect(state.orderError).toBe('Ошибка оформления заказа');
  });
});
