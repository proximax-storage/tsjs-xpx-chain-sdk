import React, { useEffect } from 'react';
import { Switch, Route } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';

import { useAuth } from '../Context/AuthContext';

import SignUp from '../Page/SignUp';
import SignIn from '../Page/SignIn';
import Home from '../Page/Home';
import SignUpSuccess from '../Page/SignUpSuccess';

const Routing: React.FC = () => {
  const { hasXpxAcc } = useAuth();

  return (
    <Switch>
      {!hasXpxAcc && (
        <PrivateRoute path='/sign-up-success' component={SignUpSuccess} />
      )}
      <Route path='/sign-up' component={SignUp} />
      <Route path='/sign-in' component={SignIn} />
      <Route path='/faq' component={SignUpSuccess} />
      <PrivateRoute path='/' component={Home} />
    </Switch>
  );
};
export default Routing;
