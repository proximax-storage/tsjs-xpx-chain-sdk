import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import useCountDown from 'react-countdown-hook';
import { LocalStorageEnum } from '../Util/Constant/LocalStorageEnum';

const Countdown: React.FC<any> = (props) => {
  const { time, isHour } = props;
  let [timeLeft, actions] = useCountDown(10000, 1000);
  const history = useHistory();

  useEffect(() => {
    const duration = +time * 60 * 1000;
    actions.start(duration);
  }, []);

  useEffect(() => {
    console.log(timeLeft);

    if (localStorage.getItem(LocalStorageEnum.IS_FIRST_COUNTDOWN)) {
      localStorage.removeItem(LocalStorageEnum.IS_FIRST_COUNTDOWN);
    } else {
      if (timeLeft <= 0) {
        console.log('next page');
        history.push('/');
      }
    }
  }, [timeLeft]);

  return isHour ? (
    <strong>{(timeLeft / 1000).toFixed(2)}</strong>
  ) : (
    <strong>{(timeLeft / 1000).toFixed(0)}</strong>
  );
};

export default Countdown;
