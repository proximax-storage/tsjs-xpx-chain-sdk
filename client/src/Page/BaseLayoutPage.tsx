import React, { Suspense } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import { AuthProvider } from '../Context/AuthContext';
import { NotificationProvider } from '../Context/NotificationContext';
import Spinner from '../Component/Spinner';

import NavBar from '../Component/NavBar';
import Header from '../Component/Header';
import RoutingPath from '../Component/Routing';

import './BaseLayoutPage.scss';

const BaseLayoutPage: React.FC = () => {
  return (
    <Router>
      <NotificationProvider>
        <Suspense fallback={Spinner}>
          <AuthProvider>
            <div className='base-layout'>
              <div className='nav-bar'>
                <NavBar />
              </div>
              <div className='header'>
                <Header />
              </div>
              <div className='content'>
                <RoutingPath />
              </div>
            </div>
          </AuthProvider>
        </Suspense>
      </NotificationProvider>
    </Router>
  );
};

export default BaseLayoutPage;
