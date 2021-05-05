import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import NavBar from '../Component/NavBar';
import Header from '../Component/Header';
import TestPage from './TestPage';
import SignUp from './SignUp';

import './BaseLayoutPage.scss';

const BaseLayoutPage: React.FC = () => {
  return (
    <Router>
      <div className="base-layout">
        <div className="nav-bar">
          <NavBar />
        </div>
        <div className="header">
          <Header>Sign In</Header>
        </div>
        <div className="content">
          <Switch>
            <Route path="/sign-up" component={SignUp} />
            <Route path="/" component={TestPage} />
          </Switch>
        </div>
      </div>
    </Router>
  );
};

export default BaseLayoutPage;
