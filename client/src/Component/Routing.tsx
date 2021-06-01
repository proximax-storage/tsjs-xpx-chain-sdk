import React, { useEffect } from 'react';
import { Switch, Route } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';

import { useAuth } from '../Context/AuthContext';

import SignUp from '../Page/SignUp';
import SignIn from '../Page/SignIn';
import Home from '../Page/Home';
import SignUpSuccess from '../Page/SignUpSuccess';
import Error404 from '../Page/Error404';
import InvestigateStepOne from '../Page/InvestigateStepOne';
import InvestigateStepTwo from '../Page/InvestigateStepTwo';

const Routing: React.FC = () => {
  const { hasXpxAcc } = useAuth();

  return (
    <Switch>
      {!hasXpxAcc && (
        <PrivateRoute exact path='/sign-up-success' component={SignUpSuccess} />
      )}
      <Route exact path='/sign-up' component={SignUp} />
      <Route exact path='/sign-in' component={SignIn} />
      <Route path='/faq' component={SignUpSuccess} />
      <PrivateRoute exact path='/' component={Home} />
      <Route
        exact
        path='/investigate-step-one'
        component={InvestigateStepOne}
      />
      <Route
        exact
        path='/investigate-step-two'
        component={InvestigateStepTwo}
      />
      <Route path='/error' component={Error404} />
      <Route component={Error404} />
    </Switch>
  );
};
export default Routing;
