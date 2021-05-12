import { useAuth } from '../Context/AuthContext';
import NavBarLogin from './NavBarHome';
import NavBar from './NavBar';

import './NavBar.scss';

const NavBarSelection: React.FC = () => {
  const { currentUser } = useAuth();

  return currentUser ? <NavBarLogin /> : <NavBar />;
};

export default NavBarSelection;
