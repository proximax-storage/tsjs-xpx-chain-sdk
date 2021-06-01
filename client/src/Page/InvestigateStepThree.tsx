import React, { useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';

import Timer from '../Component/Timer';
import Countdown from '../Component/Countdown';

import './InvestigateStepThree.scss';

const InvestigateStepThree: React.FC = () => {
  const history = useHistory();

  const onClickYes = () => {
    history.push('/investigate-step-four');
  };

  const onClickNo = () => {
    history.push('/');
  };

  return (
    <div className='investigate-step-three'>
      <div className='investigate-step-three__image'></div>
      <div className='investigate-step-three__description'>
        <p>You have been matched with a news tweet!</p>
        <p>
          Would you like to start investigating? <br /> You have &nbsp;
          <Countdown time={1} isHour={false} />
          &nbsp; left to decide.
        </p>
      </div>
      <div className='investigate-step-three__timer'></div>
      <div className='investigate-step-three__small-description'>
        <br />
        <p>You will only be revealed the news content if you pick Yes.</p>
      </div>
      <button
        className='investigate-step-three__yes-button'
        onClick={onClickYes}
      >
        Yes
      </button>
      <button className='investigate-step-three__no-button' onClick={onClickNo}>
        No
      </button>
    </div>
  );
};

export default InvestigateStepThree;
