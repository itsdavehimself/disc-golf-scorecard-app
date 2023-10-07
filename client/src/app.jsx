import { useEffect, useState } from 'react';
import { getTest } from './functions/test';

export default function App() {
  const [data, setData] = useState('Hello world');

  useEffect(() => {
    getTest()
      .then((res) => {
        setData(res.message);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="App">
      <h1>{data}</h1>
    </div>
  );
}
