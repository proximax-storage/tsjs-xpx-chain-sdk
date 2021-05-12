import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import axios from 'axios';

import { useAuth } from '../Context/AuthContext';
import './NavBarHome.scss';

const NavBarHome: React.FC = (props: any) => {
  const { signOut, currentUser } = useAuth();
  const location = useLocation();
  const [username, setUsername] = useState('LOADING...');

  const loadUsername = async () => {
    setTimeout(() => {}, 2000);

    const result = await axios.post('/api/get-username', {
      uid: currentUser.uid,
    });

    setUsername(result.data.username);
  };

  useEffect(() => {
    loadUsername();
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
            className={
              location.pathname === '/sign-up-success'
                ? 'nav-link-active'
                : 'nav-link'
            }
            activeClassName='nav-link-active'
            to='/investigate'
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
