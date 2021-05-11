import React from 'react';
import './InvestigateStepOne.scss';

const InvestigateStepOne: React.FC = () => {
  return (
    <div className='investigate-step-one'>
      <div className='investigate-step-one__image'></div>
      <div className='investigate-step-one__description'>
        <p>
          Want to unearth the truth? Contribute to our cause and detect fake
          news by being a <strong>Juror</strong>.
        </p>
        <br />
        <p>Click on the button to be queued for a news tweet!</p>
      </div>
      <button className='investigate-step-one__button'>Give me a tweet!</button>
    </div>
  );
};

export default InvestigateStepOne;
