import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import NavBar from '../Component/NavBar';
import Header from '../Component/Header';
import TestPage from './TestPage';
import SignUp from './SignUp';
import SignIn from './SignIn';

import './BaseLayoutPage.scss';

const BaseLayoutPage: React.FC = () => {
  return (
    <Router>
      <div className='base-layout'>
        <div className='nav-bar'>
          <NavBar />
        </div>
        <div className='header'>
          <Header />
        </div>
        <div className='content'>
          <Switch>
            <Route path="/sign-up" component={SignUp} />
            <Route path="/sign-in" component={SignIn} />
            <Route path="/" component={SignIn} />
          </Switch>
        </div>
      </div>
    </Router>
  );
};

export default BaseLayoutPage;
