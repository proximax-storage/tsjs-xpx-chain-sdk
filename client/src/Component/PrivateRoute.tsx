import { Route, Redirect } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import { LocalStorageEnum } from '../Util/Constant/LocalStorageEnum';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const { currentUser } = useAuth();

  console.log('Private route current user', currentUser);

  return (
    <Route
      {...rest}
      render={(props) => {
        return localStorage.getItem(LocalStorageEnum.IS_SIGN_IN) ? (
          <Component {...props} />
        ) : (
          <Redirect to='/sign-in' />
        );
      }}
    ></Route>
  );
};

export default PrivateRoute;
