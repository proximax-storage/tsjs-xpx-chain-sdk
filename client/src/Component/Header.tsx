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
      case '/error-404':
        setTitle('Error 404');
        break;
      default:
        setTitle('Home');
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
