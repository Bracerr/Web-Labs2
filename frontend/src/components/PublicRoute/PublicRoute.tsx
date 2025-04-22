import { FC } from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';

interface PublicRouteProps {
  children: React.ReactNode;
}

export const PublicRoute: FC<PublicRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAppSelector(state => state.auth);

  if (isAuthenticated) {
    return <Navigate to="/events" replace />;
  }

  return <>{children}</>;
}; 