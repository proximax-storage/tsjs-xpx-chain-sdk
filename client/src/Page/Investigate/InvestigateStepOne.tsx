import React from 'react';
import { useHistory } from 'react-router-dom';

import StepOne from '../Template/StepOne';

const InvestigateStepOne: React.FC = () => {
  const history = useHistory();
  const onNextPage = () => {
    history.push('/investigate-step-two');
  };

  return <StepOne onNextPage={onNextPage} role='investigator' />;
};

export default InvestigateStepOne;
