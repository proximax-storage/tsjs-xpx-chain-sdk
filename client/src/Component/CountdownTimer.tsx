import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

const CountDownTimer = ({ hoursMinSecs, isHour }) => {
  const { hours = 0, minutes = 0, seconds = 60 } = hoursMinSecs;
  const [[hrs, mins, secs], setTime] = React.useState([
    hours,
    minutes,
    seconds,
  ]);
  const history = useHistory();

  const tick = () => {
    if (hrs === 0 && mins === 0 && secs === 0) {
      console.log('Exit');
      history.push('/');
    } else if (mins === 0 && secs === 0) {
      setTime([hrs - 1, 59, 59]);
    } else if (secs === 0) {
      setTime([hrs, mins - 1, 59]);
    } else {
      setTime([hrs, mins, secs - 1]);
    }
  };

  const reset = () =>
    setTime([parseInt(hours), parseInt(minutes), parseInt(seconds)]);

  React.useEffect(() => {
    const timerId = setInterval(() => tick(), 1000);

    return () => {
      clearInterval(timerId);
    };
  });

  useEffect(() => {
    console.log(seconds);
  }, [seconds]);

  return isHour ? (
    <span>{`${hrs.toString().padStart(2, '0')}:${mins
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`}</span>
  ) : (
    <strong>{`${secs.toString()} seconds`}</strong>
  );
};

export default CountDownTimer;
