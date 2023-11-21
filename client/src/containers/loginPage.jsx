import { useState } from 'react';
import { useLogin } from '../hooks/useLogin';

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
    <section className="flex flex-col bg-off-white h-screen gap-4 px-3 items-center justify-center w-screen">
      <main className="bg-white rounded-lg shadow-lg px-5 py-6 w-full sm:w-1/2 md:w-1/2 lg:max-w-sm xl:max-w-sm">
        <header className="flex flex-col gap-8">
          <div>
            <h1 className="text-5xl text-black text-center">ChainSeeker</h1>
          </div>
          <h3 className="text-black text-2xl font-bold text-center">
            Login to your account
          </h3>
        </header>
        <section className="py-6">
          <form
            className="flex flex-col gap-5 text-black"
            onSubmit={handleSubmit}
          >
            <div className="flex flex-col">
              <label>Username</label>
              <input
                className={`${
                  isUsernameError
                    ? 'ring-red ring-2'
                    : 'border-white-smoke border focus:ring-2 focus:ring-jade'
                } text-black rounded-md shadow-md p-2 focus:outline-none`}
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
                } text-black rounded-md shadow-md p-2 focus:outline-none`}
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
            </div>
            {error && (
              <div className="flex items-center justify-center text-black text-sm py-2 bg-rose border rounded-md border-red">
                <div className="flex">{error}</div>
              </div>
            )}
          </form>
        </section>
      </main>
    </section>
  );
};

export default Login;
