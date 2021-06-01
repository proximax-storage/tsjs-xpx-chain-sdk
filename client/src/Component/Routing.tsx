import React, { useEffect } from 'react';
import { Switch, Route } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';

import { useAuth } from '../Context/AuthContext';

import SignUp from '../Page/SignUp';
import SignIn from '../Page/SignIn';
import Home from '../Page/Home';
import SignUpSuccess from '../Page/SignUpSuccess';
import Faq from '../Page/Faq';
import Error404 from '../Page/Error404';
import InvestigateStepOne from '../Page/Investigate/InvestigateStepOne';
import InvestigateStepTwo from '../Page/Investigate/InvestigateStepTwo';
import InvestigateStepThree from '../Page/Investigate/InvestigateStepThree';
import InvestigateStepFour from '../Page/Investigate/InvestigateStepFour';
import InvestigateStepFive from '../Page/Investigate/InvestigateStepFive';
import VerifyStepOne from '../Page/Verify/VerifyStepOne';
import VerifyStepTwo from '../Page/Verify/VerifyStepTwo';
import VerifyStepThree from '../Page/Verify/VerifyStepThree';
import VerifyStepFour from '../Page/Verify/VerifyStepFour';
import VerifyStepFive from '../Page/Verify/VerifyStepFive';

const Routing: React.FC = () => {
  const { hasXpxAcc } = useAuth();

  return (
    <Switch>
      {!hasXpxAcc && (
        <PrivateRoute exact path='/sign-up-success' component={SignUpSuccess} />
      )}
      <Route exact path='/sign-up' component={SignUp} />
      <Route exact path='/sign-in' component={SignIn} />
      <Route exact path='/faq' component={Faq} />
      <PrivateRoute exact path='/' component={Home} />
      <PrivateRoute
        exact
        path='/investigate-step-one'
        component={InvestigateStepOne}
      />
      <PrivateRoute
        exact
        path='/investigate-step-two'
        component={InvestigateStepTwo}
      />
      <PrivateRoute
        exact
        path='/investigate-step-three'
        component={InvestigateStepThree}
      />
      <PrivateRoute
        exact
        path='/investigate-step-four'
        component={InvestigateStepFour}
      />
      <PrivateRoute
        exact
        path='/investigate-step-five'
        component={InvestigateStepFive}
      />

      <PrivateRoute exact path='/verify-step-one' component={VerifyStepOne} />
      <PrivateRoute exact path='/verify-step-two' component={VerifyStepTwo} />
      <PrivateRoute
        exact
        path='/verify-step-three'
        component={VerifyStepThree}
      />
      <PrivateRoute exact path='/verify-step-four' component={VerifyStepFour} />
      <PrivateRoute exact path='/verify-step-five' component={VerifyStepFive} />
      <Route path='/error' component={Error404} />
      <Route component={Error404} />
    </Switch>
  );
};
export default Routing;
