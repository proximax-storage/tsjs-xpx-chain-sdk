import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import './Header.scss';

const Header: React.FC = () => {
  const [title, setTitle] = useState('Home');
  const location = useLocation();

  useEffect(() => {
    switch (location.pathname) {
      case '/sign-in':
        setTitle('Sign In');
        break;
      case '/sign-up':
      case '/sign-up-success':
        setTitle('Sign Up');
        break;
      case '/reset-password':
        setTitle('Reset Your Password');
        break;
      case '/faq':
        setTitle('FAQ');
        break;
      case '/investigate-step-one':
        setTitle('Investigate (1/5)');
        break;
      case '/investigate-step-two':
        setTitle('Investigate (2/5)');
        break;
      case '/investigate-step-three':
        setTitle('Investigate (3/5)');
        break;
      case '/investigate-step-four':
        setTitle('Investigate (4/5)');
        break;
      case '/investigate-step-five':
        setTitle('Investigate (5/5)');
        break;
      case '/verify-step-one':
        setTitle('Verify (1/5)');
        break;
      case '/verify-step-two':
        setTitle('Verify (2/5)');
        break;
      case '/verify-step-three':
        setTitle('Verify (3/5)');
        break;
      case '/verify-step-four':
        setTitle('Verify (4/5)');
        break;
      case '/verify-step-five':
        setTitle('Verify (5/5)');
        break;
      case '/':
        setTitle('Home');
        break;
      default:
        setTitle('Error 404');
    }
  }, [location.pathname]);

  return (
    <div className='header-container'>
      <h1>{title}</h1>
      <hr />
    </div>
  );
};

export default Header;
