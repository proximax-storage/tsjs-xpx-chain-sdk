import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

import './NavBar.scss';

const NavBar: React.FC = (props: any) => {
  const location = useLocation();

  return (
    <div className='nav-bar-container'>
      <h1>Mass Check</h1>
      <div className='flex-container'>
        <div className='nav-link-list'>
          <NavLink
            className='nav-link'
            activeClassName='nav-link-active'
            to='/sign-in'
          >
            Sign In
          </NavLink>
          <NavLink
            className={
              location.pathname === '/sign-up-success'
                ? 'nav-link-active'
                : 'nav-link'
            }
            activeClassName='nav-link-active'
            to='/sign-up'
          >
            Sign Up
          </NavLink>
          <NavLink
            className='nav-link'
            activeClassName='nav-link-active'
            to='/faq'
          >
            FAQ
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
