import { useState } from 'react';
import { useSignup } from '../../hooks/useSignup';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { signup, error, isLoading } = useSignup();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await signup(email, username, password);
  };

  return (
    <form className="signup" onSubmit={handleSubmit}>
      <h3>Sign up</h3>
      <label>Email: </label>
      <input
        type="email"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
      ></input>
      <label>Username: </label>
      <input
        type="text"
        onChange={(e) => setUsername(e.target.value)}
        value={username}
        autoComplete="username"
      ></input>
      <label>Password: </label>
      <input
        type="password"
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        autoComplete="current-password"
      ></input>

      <button disabled={isLoading}>Sign up!</button>
      {error && <div className="error">{error}</div>}
    </form>
  );
};

export default Signup;
