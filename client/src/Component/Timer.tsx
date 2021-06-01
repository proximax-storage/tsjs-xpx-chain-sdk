import React, { useEffect, useState } from 'react';

const newTime = new Date();
newTime.setSeconds(newTime.getSeconds() + 61);

const Timer: React.FC = () => {
    
    const calculateTimeLeft = () => {
        const difference = +newTime - +new Date();
        let timeLeft = {};
    
        if (difference > 0) {
          timeLeft = {
            minutes: Math.floor((difference / 1000 / 60) % 60),
            seconds: Math.floor((difference / 1000) % 60),
          };
        }
    
        return timeLeft;
      };
    
      const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
    
      useEffect(() => {
        setTimeout(() => {
          setTimeLeft(calculateTimeLeft());
        }, 1000);
      });
    
      const timerComponents = [];
    
      Object.keys(timeLeft).forEach((interval) => {
        if (!timeLeft[interval]) {
          return;
        }
    
        timerComponents.push(
          <span>
            <strong>{timeLeft[interval]}</strong> {interval}{" "}
          </span>
        );
      });
      return (
        <span>
          {timerComponents.length ? timerComponents : <span>no time</span>}
        </span>
      );
};

export default Timer