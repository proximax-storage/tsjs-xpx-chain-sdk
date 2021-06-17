import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router-dom';

import Tweet from '../../Component/Tweet';
import UploadBox from '../../Component/UploadBox';
import CountDownTimer from '../../Component/CountdownTimer';
import { storage } from '../../Util/Firebase/FirebaseConfig';
import { useNotification } from '../../Context/NotificationContext';
import downloadFile from '../../Util/Useful/DownloadFile';

import './InvestigateStepFour.scss';

const InvestigateStepFour: React.FC = () => {
  const history = useHistory();
  const [file, setFile] = useState<File>();
  const { errorToastPersistent } = useNotification();

  const onNext = async () => {
    const storageRef = storage.ref();

    // FileName: Tweet ID_DateTime_File Name
    const fileRef = storageRef.child(`${new Date().toString()}_${file.name}`);

    try {
      const res = await fileRef.put(file);
      console.log(res);
      history.push('/investigate-step-five');
    } catch (err) {
      console.log(err);
      errorToastPersistent('Upload Failed! Please Try Again.');
    }
  };

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

      <div className='investigate-step-four__download'>
        Please download the
        <Link
          to='/SAMPLE 5.pdf'
          target='_blank'
          className='investigate-step-four__download__link'
          download
        >
          {` report template here `}
        </Link>
        and add your findings directly into it.
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
