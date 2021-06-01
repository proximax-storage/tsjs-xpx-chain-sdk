import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import useCountDown from 'react-countdown-hook';

const Countdown: React.FC<any> = (props) => {
  const { time, isHour } = props;
  let [timeLeft, actions] = useCountDown(time * 6 * 1000, 1000);
  const history = useHistory();

  useEffect(() => {
    const duration = 5 * 1000;
    // const duration = +time * 60 * 1000;
    console.log('Stage: Countdown');
    console.log('Load', timeLeft);

    actions.start();
  }, []);

  useEffect(() => {
    console.log(timeLeft);

    if (timeLeft <= 0) {
      timeLeft = 5000;
    }
  }, [timeLeft]);

  return isHour ? (
    <strong>{(timeLeft / 1000).toFixed(2)}</strong>
  ) : (
    <strong>{(timeLeft / 1000).toFixed(0)}</strong>
  );
};

export default Countdown;
