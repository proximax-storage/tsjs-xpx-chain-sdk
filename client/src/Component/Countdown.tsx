import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import useCountDown from 'react-countdown-hook';

import { useNotification } from '../Context/NotificationContext';
import { LocalStorageEnum } from '../Util/Constant/LocalStorageEnum';

// time - Minutes
// isHour - True : 01:00:00 [HH:MM:SS]
// isHour - False: 60 seconds
const Countdown: React.FC<any> = (props) => {
  const { time, isHour } = props;
  const [timeLeft, actions] = useCountDown(10000, 1000);
  const { errorToastPersistent } = useNotification();
  const history = useHistory();

  useEffect(() => {
    const duration = +time * 60 * 1000;
    actions.start(duration);
  }, []);

  useEffect(() => {
    if (localStorage.getItem(LocalStorageEnum.IS_FIRST_COUNTDOWN)) {
      localStorage.removeItem(LocalStorageEnum.IS_FIRST_COUNTDOWN);
    } else {
      if (timeLeft <= 0) {
        errorToastPersistent('Time Up!');
        history.push('/');
      }
    }

    formatTime(timeLeft);
  }, [timeLeft]);

  const appendZero = (t) => {
    return ('0' + t).slice(-2);
  };

  const formatTime = (t) => {
    t /= 1000;

    let hours = Math.floor(t / 60 / 60);
    let minutes = Math.floor(t / 60);
    let seconds = t % 60;
    minutes = minutes == 60 ? 0 : minutes;

    return `${appendZero(hours)}:${appendZero(minutes)}:${appendZero(seconds)}`;
  };

  return isHour ? (
    <strong>{formatTime(timeLeft)}</strong>
  ) : (
    <strong>{(timeLeft / 1000).toFixed(0)} seconds</strong>
  );
};

export default Countdown;
