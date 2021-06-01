import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import useCountDown from 'react-countdown-hook';

import { useNotification } from '../Context/NotificationContext';
import { LocalStorageEnum } from '../Util/Constant/LocalStorageEnum';

// isHour - True : 01:00:00 [HH:MM:SS]
// isHour - False: 60 seconds

const Countdown: React.FC<any> = (props) => {
  const { time, isHour } = props;
  const [timeLeft, actions] = useCountDown(10000, 1000);
  const { errorToastPersistent } = useNotification();
  const history = useHistory();

  useEffect(() => {
    const duration = +time * 6 * 1000;
    actions.start(duration);
  }, []);

  useEffect(() => {
    console.log(timeLeft);

    if (localStorage.getItem(LocalStorageEnum.IS_FIRST_COUNTDOWN)) {
      localStorage.removeItem(LocalStorageEnum.IS_FIRST_COUNTDOWN);
    } else {
      if (timeLeft <= 0) {
        errorToastPersistent('Time Up!');
        history.push('/');
      }
    }
  }, [timeLeft]);

  return isHour ? (
    <strong>{(timeLeft / 1000).toFixed(2)}</strong>
  ) : (
    <strong>{(timeLeft / 1000).toFixed(0)} seconds</strong>
  );
};

export default Countdown;
