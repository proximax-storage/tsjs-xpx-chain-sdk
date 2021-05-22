import React from 'react';
import './InvestigateStepThree.scss';

const InvestigateStepThree: React.FC = () => {
    return (
      <div className='investigate-step-three'>
        <div className='investigate-step-three__image'></div>
        <div className='investigate-step-three__description'>
          <p>
            You have been matched with a news tweet!
          </p>
          <p>
            Would you like to start investigating?
          </p>
        </div>
        <div className='investigate-step-three__timer'>
            <p>
                Timer
            </p>
        </div>
        <div className='investigate-step-three__small-description'>
            <br/>
            <p>You will only be revealed the news content if you pick Yes.</p>
        </div>
        <button className='investigate-step-three__yes-button'>Yes</button>
        <button className='investigate-step-three__no-button'>No</button>
      </div>
    );
  };
  
  export default InvestigateStepThree;