import { FC } from 'react';
import { useParams } from 'react-router-dom';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { selectIngredientById } from '../../services/selectors/ingredientsSelectors';
import { useSelector } from '../../services/store';
import { NotFound404 } from '@pages';

export const IngredientDetails: FC = () => {
  const { id } = useParams<{ id: string }>();
  const ingredientData = useSelector(selectIngredientById(id));

  if (!ingredientData) {
    return <NotFound404 />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
