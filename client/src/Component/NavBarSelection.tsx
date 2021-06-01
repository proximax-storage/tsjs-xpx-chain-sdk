import { useAuth } from '../Context/AuthContext';
import NavBarHome from './NavBarHome';
import NavBar from './NavBar';
import {LocalStorageEnum} from '../Util/Constant/LocalStorageEnum'

import './NavBar.scss';

const NavBarSelection: React.FC = () => {
  const { currentUser } = useAuth();

  return currentUser && (localStorage.getItem(LocalStorageEnum.IS_NEW_USER) === 'true') ? <NavBarHome /> : <NavBar />;
};

export default NavBarSelection;
