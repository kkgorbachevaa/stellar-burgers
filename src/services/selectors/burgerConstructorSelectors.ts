import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../store';

export const selectConstructorItems = (state: RootState) =>
  state.burgerConstructor;

export const selectConstructorBun = (state: RootState) =>
  state.burgerConstructor.bun;

export const selectConstructorIngredients = (state: RootState) =>
  state.burgerConstructor.ingredients;

export const selectIngredientsCounters = createSelector(
  [selectConstructorBun, selectConstructorIngredients],
  (bun, ingredients) => {
    const counters: Record<string, number> = {};

    ingredients.forEach((ingredient) => {
      counters[ingredient._id] = (counters[ingredient._id] || 0) + 1;
    });

    if (bun) {
      counters[bun._id] = 2;
    }

    return counters;
  }
);
