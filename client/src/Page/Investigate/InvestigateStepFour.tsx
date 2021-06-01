import React from 'react';
import { useHistory } from 'react-router-dom';
import Tweet from '../../Component/Tweet';
import UploadBox from '../../Component/UploadBox';

import './InvestigateStepFour.scss';

const InvestigateStepFour: React.FC = () => {
  // TODO: Incorporate handle submit
  const history = useHistory();
  const onNext = () => {
    history.push('/investigate-step-five');
  };

  return (
    <div className='investigate-step-four'>
      <div className='investigate-step-four__timer'></div>

      <div className='investigate-step-four__tweet'>
        <Tweet
          name='Jam Celiac'
          tag='@jamceliac21'
          content='#Malaysia recorded a total of 2,875 new #Covid19 cases on Thursday. This is the eighth consecutive day with the number of cases above 2,000. Read more at https://bit.ly/3neKgcD'
          submitBy='Jackie Chan'
          submitTime={new Date()}
          authenticityScore={67}
          stage='Investigating'
        />
      </div>

      <br />

      <div className='investigate-step-four__description'>
        Find evidence to prove or disprove the news tweet above.
        <br />
        Compile your findings into a PDF document to submit below.
        <br />
        It will be read by the jury for their final verdict.
      </div>

      <br />

      <div className='investigate-step-four__upload-box'>
        <UploadBox />
      </div>

      <br />

      <button className='investigate-step-four__button' onClick={onNext}>
        Submit
      </button>
    </div>
  );
};

export default InvestigateStepFour;
