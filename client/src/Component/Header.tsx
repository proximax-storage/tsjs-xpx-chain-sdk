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
      case '/faq':
        setTitle('FAQ');
        break;
      case '/investigate-step-one':
        setTitle('Investigate (1/4)');
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
