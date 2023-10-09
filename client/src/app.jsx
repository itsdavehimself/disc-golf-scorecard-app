import { useEffect, useState } from 'react';
import { getTest } from './functions/test';
import Signup from './components/signup/signupPage';
import Login from './components/login/loginPage';

export default function App() {
  const [data, setData] = useState('user!');

  useEffect(() => {
    getTest()
      .then((res) => {
        setData(res);
        console.log(res);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="App">
      <h1>Welcome, {data}</h1>
    </div>
  );
}
