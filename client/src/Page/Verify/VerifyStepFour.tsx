import React from 'react';
import { useHistory } from 'react-router-dom';

const InvestigateStepFour: React.FC = () => {
  const history = useHistory();

  const onNext = () => {
    history.push('/verify-step-five');
  };

  return (
    <div>
      <h1>To be developed</h1>
      <button onClick={onNext}>Next</button>
    </div>
  );
};

export default InvestigateStepFour;
