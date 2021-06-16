import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import Tweet from '../../Component/Tweet';
import CountDownTimer from '../../Component/CountdownTimer';

import './VerifyStepFour.scss';

const VerifyStepFour: React.FC = () => {
  const [vote, setVote] = useState('');
  const [voted, setVoted] = useState(false);
  const history = useHistory();

  const onNext = () => {
    history.push('/verify-step-five');
  };

  useEffect(() => {
    setVoted(!!vote);
  }, [vote]);

  const onRealSelected = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    setVote('real');
  };

  const onFakeSelected = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    setVote('fake');
  };

  return (
    <div className='verify-step-four'>
      <div className='verify-step-four__timer'>
        Timer:&nbsp;
        <CountDownTimer
          hoursMinSecs={{ hours: 0, minutes: 30, seconds: 0 }}
          isHour={true}
        />
      </div>

      <div className='verify-step-four__container'>
        <div className='verify-step-four__container__left'>
          <div>
            <button>Research 1</button>
            <button>Research 2</button>
            <button>Research 3</button>
            <button>Research 4</button>
            <button>Research 5</button>
            <div className='verify-step-four__pdf-viewer'>Text goes here</div>
          </div>
        </div>
        <div className='verify-step-four__container__right'>
          <div className='verify-step-four__tweet'>
            <Tweet
              name='Jill Chenraya'
              tag='@jillcry'
              content='#Malaysia recorded a total of 2,875 new #Covid19 cases on Thursday. This is the eighth consecutive day with the number of cases above 2,000. Read more at https://bit.ly/3neKgcD'
              submitBy='Jackie Chan'
              submitTime={new Date()}
              authenticityScore={67}
              stage='Verifying'
            />
          </div>
          <div>
            <button
              className={vote === 'real' ? 'selected-real' : 'deselected-real'}
              onClick={(e) => onRealSelected(e)}
            >
              Real
            </button>
            <button
              className={vote === 'fake' ? 'selected-fake' : 'deselected-fake'}
              onClick={(e) => onFakeSelected(e)}
            >
              Fake
            </button>
          </div>
          <button className='confirm' onClick={onNext} disabled={!voted}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyStepFour;
