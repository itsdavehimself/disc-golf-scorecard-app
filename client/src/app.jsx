import { useEffect, useState } from 'react';
import Signup from './components/Signup/signupPage';
import Login from './components/Login/loginPage';
import Navbar from './components/Navbar/navbar';

export default function App() {
  return (
    <div className="App">
      <Navbar />
      <h1>Welcome</h1>
    </div>
  );
}
