import { Navigate } from 'react-router-dom';
import { type ReactNode, useContext } from 'react';
import { AuthContext } from '@/context/auth-context';


type PrivateRouteProps = {
    children: ReactNode;
  };

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { currentUser } = useContext(AuthContext);

  return currentUser ? children : <Navigate to="/sign-in" replace />;
};

export default PrivateRoute;
