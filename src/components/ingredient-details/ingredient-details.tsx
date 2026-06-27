import { FC } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { selectIngredientById } from '../../services/selectors/ingredientsSelectors';
import { useSelector } from '../../services/store';
import { NotFound404 } from '@pages';

export const IngredientDetails: FC = () => {
  const { id } = useParams<{ id: string }>();
  const ingredientData = useSelector(selectIngredientById(id));
  const location = useLocation();
  const isModal = Boolean(location.state?.background);

  if (!ingredientData) {
    return <NotFound404 />;
  }

  return (
    <IngredientDetailsUI ingredientData={ingredientData} isModal={isModal} />
  );
};
