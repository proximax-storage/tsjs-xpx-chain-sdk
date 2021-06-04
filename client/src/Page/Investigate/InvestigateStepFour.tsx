import React, { useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import Tweet from '../../Component/Tweet';
import UploadBox from '../../Component/UploadBox';

import './InvestigateStepFour.scss';
import CountDownTimer from '../../Component/CountdownTimer';

const InvestigateStepFour: React.FC = () => {
  // TODO: Incorporate handle submit
  const history = useHistory();
  const onNext = () => {
    history.push('/investigate-step-five');
  };
  const [file, setFile] = useState<File>();

  useEffect(() => {
    console.log('File', file);
    console.log(!!file);
  }, [file]);

  return (
    <div className='investigate-step-four'>
      <div className='investigate-step-four__timer'>
        Timer:&nbsp;
        <CountDownTimer
          hoursMinSecs={{ hours: 1, minutes: 0, seconds: 0 }}
          isHour={true}
        />
      </div>

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
        <UploadBox onSetFile={setFile} />
      </div>

      <br />

      <button
        className='investigate-step-four__button'
        onClick={onNext}
        disabled={!!!file}
      >
        Submit
      </button>
    </div>
  );
};

export default InvestigateStepFour;
