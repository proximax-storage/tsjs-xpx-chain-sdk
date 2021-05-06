import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import { AuthProvider } from '../Context/AuthContext';

import NavBar from '../Component/NavBar';
import Header from '../Component/Header';
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
          <AuthProvider>
            <Switch>
              <Route path='/sign-up' component={SignUp} />
              <Route path='/sign-in' component={SignIn} />
              <Route path='/' component={SignIn} />
            </Switch>
          </AuthProvider>
        </div>
      </div>
    </Router>
  );
};

export default BaseLayoutPage;
