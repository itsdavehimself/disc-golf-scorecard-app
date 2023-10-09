import { useEffect, useState } from 'react';
import Signup from './components/Signup/signupPage';
import Login from './components/Login/loginPage';
import Navbar from './components/Navbar/navbar';
import { Outlet } from 'react-router-dom';

export default function App() {
  return (
    <div className="App">
      <Navbar />
      <Outlet />
    </div>
  );
}
