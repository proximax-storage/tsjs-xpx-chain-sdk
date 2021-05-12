import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth,AuthProvider } from '../Context/AuthContext';
import './NavBar.scss';

/*TODO: Retrive Username */ 
const NavBar_Login: React.FC = (props: any) => {
  const { signOut, currentUser } = useAuth();
  const location = useLocation();
  return (  
    <div className='nav-bar-container'>
      <h1>User Name</h1>
      <h1>XPX Balance</h1>
      <div className='flex-container'>
        <div className='nav-link-list'>
          <NavLink
            className='nav-link'
            activeClassName='nav-link-active'
            to='/homepage'
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
            to='/sign-out'
            onClick={signOut}
          >
            Log Out
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default NavBar_Login;