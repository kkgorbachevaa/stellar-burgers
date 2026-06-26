import type { RootState } from '../store';

export const selectConstructorItems = (state: RootState) =>
  state.burgerConstructor;

export const selectIngredientsCounters = (state: RootState) => {
  const { bun, ingredients } = selectConstructorItems(state);
  const counters: Record<string, number> = {};

  ingredients.forEach((ingredient) => {
    if (!counters[ingredient._id]) {
      counters[ingredient._id] = 0;
    }

    counters[ingredient._id]++;
  });

  if (bun) {
    counters[bun._id] = 2;
  }

  return counters;
};
