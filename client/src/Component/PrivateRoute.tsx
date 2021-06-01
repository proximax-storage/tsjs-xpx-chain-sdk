import { Route, Redirect } from 'react-router-dom';
import { LocalStorageEnum } from '../Util/Constant/LocalStorageEnum';

const PrivateRoute = ({ component: Component, ...rest }) => {
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
