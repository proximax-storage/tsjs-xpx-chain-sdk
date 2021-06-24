import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LocalStorageEnum } from '../Util/Constant/LocalStorageEnum';
import { useNotification } from '../Context/NotificationContext';

import './NavBar.scss';

const NavBar: React.FC = (props: any) => {
  const { pathname } = useLocation();
  const { warnToast } = useNotification();

  const onNext = (event) => {
    if (localStorage.getItem(LocalStorageEnum.STAGE) === 'sign-up-success') {
      event.preventDefault();
      warnToast('Please Complete Sign-Up Application Before Proceeding');
    }
  };

  return (
    <div className='nav-bar-container'>
      <h1>Mass Check</h1>
      <div className='flex-container'>
        <div className='nav-link-list'>
          <NavLink
            className='nav-link'
            activeClassName='nav-link-active'
            isActive={() => ['/sign-in', '/reset-password'].includes(pathname)}
            to='/sign-in'
            onClick={onNext}
          >
            Sign In
          </NavLink>
          <NavLink
            className={'nav-link'}
            activeClassName='nav-link-active'
            isActive={() => ['/sign-up', '/sign-up-success'].includes(pathname)}
            to='/sign-up'
            onClick={onNext}
          >
            Sign Up
          </NavLink>
          <NavLink
            className='nav-link'
            activeClassName='nav-link-active'
            to='/faq'
            onClick={onNext}
          >
            FAQ
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
