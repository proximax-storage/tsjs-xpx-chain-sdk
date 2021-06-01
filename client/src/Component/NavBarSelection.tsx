import { useLocation } from 'react-router-dom';

import { useAuth } from '../Context/AuthContext';
import NavBarHome from './NavBarHome';
import NavBar from './NavBar';

import './NavBar.scss';

const NavBarSelection: React.FC = () => {
  const { currentUser } = useAuth();
  const location = useLocation();

  return !currentUser || location.pathname === '/sign-up-success' ? (
    <NavBar />
  ) : (
    <NavBarHome />
  );
};

export default NavBarSelection;
