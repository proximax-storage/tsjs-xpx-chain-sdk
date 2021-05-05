import React from 'react';

import './Header.scss';

const Header: React.FC = (props) => {
  return (
    <div className="header-container">
      <h1>{props.children}</h1>
      <hr />
    </div>
  );
};

export default Header;
