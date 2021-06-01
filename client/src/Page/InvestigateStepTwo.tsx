import React from 'react';
import { useHistory } from 'react-router-dom';
import { LocalStorageEnum } from '../Util/Constant/LocalStorageEnum';

import './InvestigateStepTwo.scss';

const InvestigateStepTwo: React.FC = () => {
  const history = useHistory();

  const onCancel = () => {
    history.push('/');
  };

  // TODO Match tweet
  const matchTweet = () => {
    localStorage.setItem(LocalStorageEnum.IS_FIRST_COUNTDOWN, 'true');
    history.push('/investigate-step-three');
  };

  return (
    <div className='investigate-step-two'>
      <div className='investigate-step-two__animation'></div>
      <div className='investigate-step-two__description'>
        <br />
        <p>Matching you to a news tweet...</p>
      </div>
      <button className='investigate-step-two__button' onClick={onCancel}>
        Cancel
      </button>
      <button className='investigate-step-two__button' onClick={matchTweet}>
        Next
      </button>
    </div>
  );
};

export default InvestigateStepTwo;
