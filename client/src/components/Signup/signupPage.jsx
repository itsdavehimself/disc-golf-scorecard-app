import { useState } from 'react';
import { useSignup } from '../../hooks/useSignup';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isEmailError, setIsEmailError] = useState(false);
  const [isUsernameError, setIsUsernameError] = useState(false);
  const [isPasswordError, setIsPasswordError] = useState(false);

  const { signup, error, isLoading } = useSignup();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsEmailError(email === '' ? true : false);
    setIsUsernameError(username === '' ? true : false);
    setIsPasswordError(password === '' ? true : false);
    if (isEmailError || isUsernameError || isPasswordError) {
      return;
    }
    await signup(email, username, password);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const validateUsername = (username) => {
    const usernameRegex = /^(?=.*[a-zA-Z]{1,})(?=.*[\d]{0,})[a-zA-Z0-9]{4,14}$/;
    return usernameRegex.test(username);
  };

  const validatePassword = (password) => {
    const passwordRegex =
      /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\w\d\s:])([^\s]){8,16}$/;
    return passwordRegex.test(password);
  };

  const handleEmailChange = (e) => {
    const emailInput = e.target.value;
    setEmail(emailInput);
    const isValidEmail = validateEmail(emailInput);
    if (!isValidEmail) {
      setIsEmailError(true);
    } else {
      setIsEmailError(false);
    }
  };

  const handleUserChange = (e) => {
    const usernameInput = e.target.value;
    setUsername(usernameInput);
    const isValidUsername = validateUsername(usernameInput);
    if (!isValidUsername) {
      setIsUsernameError(true);
    } else {
      setIsUsernameError(false);
    }
  };

  const handlePasswordChange = (e) => {
    const passwordInput = e.target.value;
    setPassword(passwordInput);
    const isValidPassword = validatePassword(passwordInput);
    if (!isValidPassword) {
      setIsPasswordError(true);
    } else {
      setIsPasswordError(false);
    }
  };

  return (
    <div className="flex flex-col bg-off-white h-screen gap-4 px-7 md:items-center justify-center w-screen">
      <div className="flex flex-col gap-4">
        <h3 className="flex flex-col md:items-center md:text-center justify-center text-black text-4xl font-semibold">
          Ace or tree, <br></br>track it here.
        </h3>
        <p className="text-black text-lg">
          Join ChainSeeker now. It&apos;s free!
        </p>
      </div>
      <form
        className="flex flex-col gap-5 w-full sm:w-1/2 md:w-1/2 lg:w-1/3 xl:w-1/4"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col">
          <label>Email </label>
          <input
            className={`${
              isEmailError
                ? 'ring-red ring-2'
                : 'border-white-smoke border focus:ring-2 focus:ring-jade'
            } text-black rounded-md shadow-md p-2 focus:outline-none`}
            type="email"
            onChange={handleEmailChange}
            value={email}
          ></input>
          {isEmailError && (
            <div className="text-sm pt-1 text-vermillion">
              Please enter a valid email
            </div>
          )}
        </div>
        <div className="flex flex-col">
          <label>Username </label>
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
              Your username must be between 4-14 characters long and contain
              only numbers or letters.
            </div>
          )}
        </div>
        <div className="flex flex-col">
          <label>Password </label>
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
              Your password must be between 8-20 characters long, contain at
              least one number, one uppercase letter, and one symbol (!@#$%^&*).
            </div>
          )}
        </div>
        <button
          disabled={isLoading}
          className="bg-jade py-3 rounded-md text-off-white font-semibold cursor-pointer hover:bg-emerald transition-colors"
        >
          Sign up!
        </button>
        {error && (
          <div className="flex items-center justify-center text-black text-sm px-3 py-2 bg-rose border rounded-md border-red">
            <div className="flex">{error[0].msg}</div>
          </div>
        )}
      </form>
    </div>
  );
};

export default Signup;
