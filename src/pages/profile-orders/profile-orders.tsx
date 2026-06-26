import { Preloader } from '@ui';
import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import {
  selectProfileOrders,
  selectProfileOrdersError,
  selectProfileOrdersLoading
} from '../../services/selectors/profileOrdersSelectors';
import { fetchProfileOrders } from '../../services/slices/profileOrdersSlice';
import { useDispatch, useSelector } from '../../services/store';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectProfileOrders);
  const isLoading = useSelector(selectProfileOrdersLoading);
  const error = useSelector(selectProfileOrdersError);

  useEffect(() => {
    dispatch(fetchProfileOrders());
  }, [dispatch]);

  if (isLoading) {
    return <Preloader />;
  }

  if (error) {
    return <p className='text text_type_main-medium pt-10'>{error}</p>;
  }

  return <ProfileOrdersUI orders={orders} />;
};
