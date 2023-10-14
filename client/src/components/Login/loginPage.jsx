import { useState } from 'react';
import { useLogin } from '../../hooks/useLogin';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isUsernameError, setIsUsernameError] = useState(false);
  const [isPasswordError, setIsPasswordError] = useState(false);

  const { login, error, isLoading } = useLogin();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUsernameError(username === '' ? true : false);
    setIsPasswordError(password === '' ? true : false);

    if (isUsernameError || isPasswordError) {
      return;
    }

    await login(username, password);
  };

  const handleUserChange = (e) => {
    const usernameInput = e.target.value;
    setUsername(usernameInput);
    if (usernameInput === '') {
      setIsUsernameError(true);
    } else {
      setIsUsernameError(false);
    }
  };

  const handlePasswordChange = (e) => {
    const passwordInput = e.target.value;
    setPassword(passwordInput);
    if (passwordInput === '') {
      setIsPasswordError(true);
    } else {
      setIsPasswordError(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 h-screen bg-off-white pt-36 justify-start items-center">
      <div className="flex flex-col gap-10">
        <div>
          <h1 className="text-5xl text-black-olive">ChainSeeker</h1>
        </div>
        <h3 className="text-black-olive text-2xl font-bold">
          Login to your account
        </h3>
      </div>
      <div className="bg-off-white w-screen py-12 px-7 sm:w-1/2 md:w-1/2 lg:w-1/3 xl:w-1/4">
        <form
          className="flex flex-col gap-5 text-black-olive login"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col">
            <label>Username</label>
            <input
              className={`${
                isUsernameError
                  ? 'ring-red ring-2'
                  : 'border-white-smoke border focus:ring-2 focus:ring-jade'
              } text-black-olive rounded-md shadow-md p-2 focus:outline-none`}
              type="text"
              onChange={handleUserChange}
              value={username}
              autoComplete="username"
            ></input>
            {isUsernameError && (
              <div className="text-sm pt-1 text-vermillion">
                Please enter your username
              </div>
            )}
          </div>
          <div className="flex flex-col">
            <label>Password</label>
            <input
              className={`${
                isPasswordError
                  ? 'ring-red ring-2'
                  : 'border-white-smoke border focus:ring-2 focus:ring-jade'
              } text-black-olive rounded-md shadow-md p-2 focus:outline-none`}
              type="password"
              onChange={handlePasswordChange}
              value={password}
              autoComplete="current-password"
            ></input>
            {isPasswordError && (
              <div className="text-sm pt-1 text-vermillion">
                Please enter your password
              </div>
            )}
          </div>
          <div className="flex flex-col gap-4">
            <button
              disabled={isLoading}
              className="bg-jade py-3 rounded-md text-off-white font-semibold cursor-pointer hover:bg-emerald transition-colors"
            >
              Login
            </button>
            <div className="flex items-center justify-center px-16">
              <button className=" text-black-olive">Forgot password?</button>
            </div>
          </div>
          {error && (
            <div className="flex items-center justify-center text-black-olive text-sm px-3 py-2 bg-rose border rounded-md border-red">
              <div className="flex">{error}</div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;
