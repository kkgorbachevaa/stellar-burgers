import { FC, useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { selectIngredients } from '../../services/selectors/ingredientsSelectors';
import {
  selectOrderByNumber,
  selectCurrentOrderError,
  selectCurrentOrderLoading
} from '../../services/selectors/feedSelectors';
import { useSelector, useDispatch } from '../../services/store';
import { fetchOrderByNumber } from '../../services/slices/feedSlice';
import { NotFound404 } from '@pages';

export const OrderInfo: FC = () => {
  const { number } = useParams<{ number: string }>();
  const orderNumber = Number(number);

  const orderData = useSelector(selectOrderByNumber(orderNumber));
  const dispatch = useDispatch();
  const isLoading = useSelector(selectCurrentOrderLoading);
  const error = useSelector(selectCurrentOrderError);

  useEffect(() => {
    if (!orderData && !Number.isNaN(orderNumber)) {
      dispatch(fetchOrderByNumber(orderNumber));
    }
  }, [dispatch, orderData, orderNumber]);

  const ingredients = useSelector(selectIngredients);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);

          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (isLoading) {
    return <Preloader />;
  }

  if (Number.isNaN(orderNumber) || error) {
    return <NotFound404 />;
  }

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
