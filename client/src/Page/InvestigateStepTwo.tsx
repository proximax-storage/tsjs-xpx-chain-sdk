import React from 'react';
import { useHistory } from 'react-router-dom';
import './InvestigateStepTwo.scss';


const InvestigateStepTwo: React.FC = () => {
const history = useHistory();  
const onCancel = () => {
    history.push('/');
}
  return (
    <div className='investigate-step-two'>
      <div className='investigate-step-two__animation'></div>
      <div className='investigate-step-two__description'>
        <br />
        <p>Matching you to a news tweet...</p>
      </div>
      <button className='investigate-step-two__button' 
      onClick={onCancel}>
          Cancel
        </button>
    </div>
  );
};

export default InvestigateStepTwo;
