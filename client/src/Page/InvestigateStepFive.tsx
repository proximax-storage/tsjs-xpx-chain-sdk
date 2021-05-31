import React from 'react';
import { useHistory } from 'react-router-dom';
import './InvestigateStepFive.scss';


const InvestigateStepFive: React.FC = () => {
const history = useHistory();  
const onHome = () => {
    history.push('/');
}
  return (
    <div className='investigate-step-five'>
      <div className='investigate-step-five__description'>
        <br />
        <p>Thanks for your contribution, your report 
           <br/>
          has been submitted successfully!
          <br/>
          <br/>
          Only when all the reports are collected would 
          <br/>
          the news tweet progress to the verification
          <br/> 
          stage.
        </p>
      </div>
      <button className='investigate-step-five__button'  onClick={onHome}>Home</button>
    </div>
  );
};

export default InvestigateStepFive;