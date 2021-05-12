import { Route, Redirect } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const { currentUser } = useAuth();

  console.log('Private route current user', currentUser);

  return (
    <Route
      {...rest}
      render={(props) => {
        return currentUser ? (
          <Component {...props} />
        ) : (
          <Redirect to='/sign-in' />
        );
      }}
    ></Route>
  );
};

export default PrivateRoute;
