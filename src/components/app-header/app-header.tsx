import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { selectUser } from '../../services/selectors/userSelectors';
import { useSelector } from '../../services/store';

export const AppHeader: FC = () => {
  const user = useSelector(selectUser);

  return <AppHeaderUI userName={user?.name || ''} />;
};
