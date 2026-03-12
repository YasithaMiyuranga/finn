// src/pages/Home.js
import React from 'react';
import Authrouter from './authrouter';
import Welcomeouter from './welcomeouter';
import DashboardRouter from './dashboardRouter';
import PoliceRouter from './policeRouter';


import { Route, Routes } from 'react-router-dom';

const Approuter = () => {
  return (
    <>
      <Routes>
        <Route path="/auth/*" element={<Authrouter />} />
        <Route path="/dashboard/*" element={<DashboardRouter />} />
        <Route path="/police/*" element={<PoliceRouter />} />
        <Route path="/*" element={<Welcomeouter />} />
      </Routes>
    </>
  );
};

export default Approuter;