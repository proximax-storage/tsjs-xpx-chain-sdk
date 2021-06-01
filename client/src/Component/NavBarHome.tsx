import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useHistory } from 'react-router-dom';
import { LocalStorageEnum } from '../Util/Constant/LocalStorageEnum';

import { useAuth } from '../Context/AuthContext';
import { getUserInfoByUid } from '../Util/API/NavBarHomeAPI';

import './NavBarHome.scss';

const NavBarHome: React.FC = (props: any) => {
  const { signOut, currentUser } = useAuth();
  const [username, setUsername] = useState('LOADING...');
  const { pathname } = useLocation();

  const loadUsername = () => {
    setTimeout(async () => {
      const result = await getUserInfoByUid(currentUser.uid);

      const { address } = result.data.userInfo;
      localStorage.setItem(LocalStorageEnum.ADDRESS, address);
      localStorage.setItem(LocalStorageEnum.IS_NEW_USER, null);

      setUsername(localStorage.getItem(LocalStorageEnum.DISPLAY_NAME));
    }, 500);
  };

  const history = useHistory();

  useEffect(() => {
    loadUsername();
    history.push('/');
  }, []);

  return (
    <div className='nav-bar-home-container'>
      <div className='flex-container'>
        <h1>{username}</h1>
        <div className='nav-link-list'>
          <NavLink
            className='nav-link'
            activeClassName='nav-link-active'
            exact
            to='/'
          >
            Home
          </NavLink>
          <NavLink
            className='nav-link'
            activeClassName='nav-link-active'
            isActive={() =>
              [
                '/investigate-step-one',
                '/investigate-step-two',
                '/investigate-step-three',
                '/investigate-step-four',
                '/investigate-step-five',
              ].includes(pathname)
            }
            to='/investigate-step-one'
          >
            Investigate
          </NavLink>
          <NavLink
            className='nav-link'
            activeClassName='nav-link-active'
            to='/verify'
          >
            Verify
          </NavLink>
        </div>
        <div className='nav-link-list'>
          <NavLink
            className='nav-link'
            activeClassName='nav-link-active'
            to='/faq'
          >
            FAQ
          </NavLink>
          <NavLink
            className='nav-link'
            activeClassName='nav-link-active'
            to='/sign-in'
            onClick={signOut}
          >
            Sign Out
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default NavBarHome;
