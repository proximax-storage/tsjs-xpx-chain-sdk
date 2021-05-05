import React from 'react';
import { useLocation } from 'react-router-dom';

import './Header.scss';

const Header: React.FC = () => {
  const location = useLocation();
  return (
    <div className='header-container'>
      <h1>
        {location.pathname === '/sign-in'
          ? 'Sign In'
          : location.pathname === '/sign-up'
          ? 'Sign Up'
          : location.pathname === '/faq'
          ? 'FAQ'
          : ''}
      </h1>
      <hr />
    </div>
  );
};

export default Header;
