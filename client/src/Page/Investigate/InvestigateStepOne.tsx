import React from 'react';
import { useHistory } from 'react-router-dom';
import './InvestigateStepOne.scss';

const InvestigateStepOne: React.FC = () => {
  const history = useHistory();
  const onNextPage = () => {
    history.push('/investigate-step-two');
  };
  
  return (
    <div className='investigate-step-one'>
      <div className='investigate-step-one__image'></div>
      <div className='investigate-step-one_description'>
        <p>
          Want to unearth the truth? Contribute to our cause and detect fake
          news by being a <strong>Juror</strong>.
        </p>
        <br />
        <p>Click on the button to be queued for a news tweet!</p>
      </div>
      <button className='investigate-step-one__button' onClick={onNextPage}>
        Give me a tweet!
      </button>
    </div>
  );
};

export default InvestigateStepOne;
