import type { RootState } from '../store';

export const selectIngredients = (state: RootState) =>
  state.ingredients.ingredients;

export const selectIngredientsLoading = (state: RootState) =>
  state.ingredients.isLoading;

export const selectIngredientsError = (state: RootState) =>
  state.ingredients.error;

export const selectBuns = (state: RootState) =>
  selectIngredients(state).filter((ingredient) => ingredient.type === 'bun');

export const selectMains = (state: RootState) =>
  selectIngredients(state).filter((ingredient) => ingredient.type === 'main');

export const selectSauces = (state: RootState) =>
  selectIngredients(state).filter((ingredient) => ingredient.type === 'sauce');

export const selectIngredientById =
  (id: string | undefined) => (state: RootState) =>
    selectIngredients(state).find((ingredient) => ingredient._id === id);
