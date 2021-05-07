import React from 'react';
import { Switch, Route } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';

import SignUp from '../Page/SignUp';
import SignIn from '../Page/SignIn';
import Home from '../Page/Home';
import SignUpSuccess from '../Page/SignUpSuccess';

const Routing: React.FC = () => {
  return (
    <Switch>
      <PrivateRoute path='/sign-up-success' component={SignUpSuccess} />
      <Route path='/sign-up' component={SignUp} />
      <Route path='/sign-in' component={SignIn} />
      <Route path='/faq' component={SignUpSuccess} />
      <PrivateRoute path='/' component={Home} />
    </Switch>
  );
};
export default Routing;
