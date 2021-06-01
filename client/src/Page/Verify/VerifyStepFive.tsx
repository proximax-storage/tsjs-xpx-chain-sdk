import React from 'react';

import StepFive from '../Template/StepFive';

const InvestigateStepFive: React.FC = () => {
  return (
    <StepFive
      tqStatement='Thanks for your contribution, your verdict has been recorded successfully!'
      feedbackStatement='Only when all the jurors have passed their verdicts would the news tweet be completely verified.'
    />
  );
};

export default InvestigateStepFive;
