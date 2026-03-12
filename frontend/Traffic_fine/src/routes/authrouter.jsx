// src/pages/Home.js
import React from 'react';
import Register from '../features/Auth/register';
import Login from '../features/Auth/login';
import Departmentt from '../features/Auth/Departmentt';

import { Route, Routes } from 'react-router-dom';

const authrouter = () => {
  return (
    <>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/departmentt" element={<Departmentt />} />
      </Routes>
    </>
  );
};

export default authrouter;