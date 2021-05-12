import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import axios from 'axios';

import { useAuth } from '../Context/AuthContext';
import './NavBar.scss';

const NavBarHome: React.FC = (props: any) => {
  const { signOut, currentUser } = useAuth();
  const location = useLocation();
  const [username, setUsername] = useState('LOADING...');

  const loadUsername = async () => {
    const result = await axios.post('/api/get-username', {
      uid: currentUser.uid,
    });

    setUsername(result.data.username);
  };

  useEffect(() => {
    loadUsername();
  }, []);

  return (
    <div className='nav-bar-container'>
      <h1>{username}</h1>
      <div className='flex-container'>
        <div className='nav-link-list'>
          <NavLink
            className='nav-link'
            activeClassName='nav-link-active'
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
            to='/sign-out'
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
