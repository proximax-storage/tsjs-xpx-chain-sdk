import React, { Suspense } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import { AuthProvider } from '../Context/AuthContext';
import { NotificationProvider } from '../Context/NotificationContext';
import Spinner from '../Component/Spinner';

import NavBarSelection from '../Component/NavBarSelection';
import Header from '../Component/Header';
import RoutingPath from '../Component/Routing';

import './BaseLayoutPage.scss';
import InvestigateStepOne from './InvestigateStepOne';

const BaseLayoutPage: React.FC = () => {
  return (
    <Router>
      <NotificationProvider>
        <Suspense fallback={Spinner}>
          <AuthProvider>
            <div className='base-layout'>
              <div className='nav-bar'>
                <NavBarSelection />
              </div>
              <div className='header'>
                <Header />
              </div>
              <div className='content'>
                {/* <RoutingPath /> */}
                <InvestigateStepOne />
              </div>
            </div>
          </AuthProvider>
        </Suspense>
      </NotificationProvider>
    </Router>
  );
};

export default BaseLayoutPage;
