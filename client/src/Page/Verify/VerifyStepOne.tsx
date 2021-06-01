import React from 'react';
import { useHistory } from 'react-router-dom';

import StepOne from '../Template/StepOne';

const VerifyStepOne: React.FC = () => {
  const history = useHistory();
  const onNextPage = () => {
    history.push('/verify-step-two');
  };

  return <StepOne onNextPage={onNextPage} role='Juror' />;
};

export default VerifyStepOne;
