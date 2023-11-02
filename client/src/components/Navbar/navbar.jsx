import { useLogout } from '../../hooks/useLogout';
import { Link, useLocation } from 'react-router-dom';
import { useAuthContext } from '../../hooks/useAuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes, faUser } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { Transition } from '@headlessui/react';
import PropTypes from 'prop-types';

export default function Navbar({ toggleSidebar, isSideBarOpen }) {
  const { logout } = useLogout();
  const { user } = useAuthContext();
  const [open, setOpen] = useState(false);

  const location = useLocation();

  const handleMenu = () => {
    setOpen((prev) => !prev);
  };

  const handleClick = () => {
    setOpen((prev) => !prev);
    logout();
  };

  const isSignUpRoute = location.pathname === '/signup';
  const isNewRoundRoute = location.pathname === '/newround';

  return (
    <nav className="z-50 absolute">
      {!user && (
        <div className="bg-white fixed w-full">
          <div className="mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <Link to={'/'}>
                  <button>ChainSeeker</button>
                </Link>
              </div>
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4 font-semibold">
                  <Link to={'/login'}>
                    <button className="text-black hover:text-jade px-3 py-2 cursor-pointer rounded-md">
                      Login
                    </button>
                  </Link>
                  {!isSignUpRoute ? (
                    <Link to={'/signup'}>
                      <button className="bg-jade px-3 py-2 rounded-md text-off-white font-semibold cursor-pointer hover:bg-emerald transition-colors ">
                        Get Started
                      </button>
                    </Link>
                  ) : null}
                </div>
              </div>
              <div className="-mr-2 flex md:hidden gap-2">
                {!isSignUpRoute ? (
                  <Link to={'/signup'}>
                    <button className="bg-jade px-3 py-2 rounded-md text-off-white font-semibold cursor-pointer hover:bg-emerald transition-colors ">
                      Get Started
                    </button>
                  </Link>
                ) : null}

                <button
                  type="button"
                  onClick={handleMenu}
                  className="inline-flex items-center justify-center text-xl px-3 py-2
                rounded-md text-black hover:text-jade hover-bg-honeydew
                focus:outline-none focus:ring-2 focus:ring-offset-2"
                >
                  {open ? (
                    <FontAwesomeIcon icon={faTimes} />
                  ) : (
                    <FontAwesomeIcon icon={faBars} />
                  )}
                </button>
              </div>
            </div>
          </div>
          <Transition
            show={open}
            enter="transform transition ease-in-out duration-500 sm:duration-500"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="transform transition ease-in-out duration-500 sm:duration-500"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
          >
            <div className="md:hidden">
              <div className="absolute inset-x-0 top-3 mx-3 rounded-md bg-off-white flex flex-col text-right text-lg pr-3 ox-2 pt-2 pb-3 space-y-1 sm:px-3">
                <Link to={'/login'}>
                  <button
                    onClick={handleMenu}
                    className=" text-black  hover:text-jade px-3 py-2 cursor-pointer rounded-md"
                  >
                    Login
                  </button>
                </Link>
                <Link to={'/login'}>
                  <button
                    onClick={handleMenu}
                    className="text-black hover-text-jade px-3 py-2 cursor-pointer rounded-md"
                  >
                    About
                  </button>
                </Link>
                <Link to="https://github.com/itsdavehimself/disc-golf-scorecard-app">
                  <button
                    onClick={handleMenu}
                    className="text-black hover-text-jade px-3 py-2 cursor-pointer rounded-md"
                  >
                    Repo
                  </button>
                </Link>
                <Link to="https://github.com/itsdavehimself">
                  <button
                    onClick={handleMenu}
                    className="text-black hover-text-jade px-3 py-2 cursor-pointer rounded-md"
                  >
                    David&apos;s Github
                  </button>
                </Link>
              </div>
            </div>
          </Transition>
        </div>
      )}
      {user && (
        <div className="bg-white fixed w-full">
          <div className="mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <div className="hidden md:flex">
                  <Link to={'/'}>
                    <button>ChainSeeker</button>
                  </Link>
                </div>
                <button
                  type="button"
                  onClick={toggleSidebar}
                  className="md:hidden inline-flex items-center justify-center text-xl px-3 py-2
                rounded-md text-black hover:text-jade hover-bg-honeydew
                focus:outline-none focus:ring-2 focus:ring-offset-2"
                >
                  {isSideBarOpen ? (
                    <FontAwesomeIcon icon={faTimes} />
                  ) : (
                    <FontAwesomeIcon icon={faBars} />
                  )}
                </button>
              </div>
              <div className="hidden md:flex gap-4 items-center text-black">
                {!isNewRoundRoute && (
                  <Link to="/newround">
                    <button className="bg-jade px-3 py-2 rounded-md text-off-white font-semibold cursor-pointer hover:bg-emerald transition-colors">
                      Start a round
                    </button>
                  </Link>
                )}
                <button
                  onClick={handleMenu}
                  className="flex items-center justify-center space-x-2 px-2 py-2 rounded-md hover:bg-mint transition-colors"
                >
                  <div
                    className="inline-flex items-center justify-center text-lg h-8 w-8
                rounded-full text-off-white bg-jade"
                  >
                    <FontAwesomeIcon icon={faUser} />
                  </div>
                  <div>{user.user.username}</div>
                </button>
              </div>
              <div className="-mr-2 flex md:hidden gap-2">
                <button
                  type="button"
                  onClick={handleMenu}
                  className="inline-flex items-center justify-center text-lg h-9 w-9
                rounded-full text-off-white bg-jade"
                >
                  <FontAwesomeIcon icon={faUser} />
                </button>
              </div>
            </div>
          </div>
          <Transition
            show={open}
            enter="transform transition ease-in-out duration-500 sm:duration-500"
            enterFrom="translate-x-full"
            enterTo="translate-x-0 md:translate-x-70r lg:translate-x-78r"
            leave="transform transition ease-in-out duration-500 sm:duration-500"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
          >
            <div className="absolute inset-x-0 top-3 mx-3 rounded-md bg-off-white md:w-1/4 lg:w-1/5">
              <div className="flex flex-col text-right items-end text-lg pr-3 ox-2 pt-2 pb-3 space-y-1 sm:px-3 gap-4 text-black">
                <Link to="https://github.com/itsdavehimself/disc-golf-scorecard-app">
                  <button onClick={handleMenu}>Repo</button>
                </Link>
                <Link to="https://github.com/itsdavehimself">
                  <button onClick={handleMenu}>David&apos;s Github</button>
                </Link>
                <Link to="/settings">
                  <button onClick={handleMenu}>Settings</button>
                </Link>
                <button onClick={handleClick}>Logout</button>
              </div>
            </div>
          </Transition>
          <Transition
            show={isSideBarOpen}
            enter="transform transition ease-in-out duration-500 sm:duration-500"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transform transition ease-in-out duration-500 sm:duration-500"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <div className="md:hidden">
              <div className="absolute inset-x-0 top-3 mx-3 rounded-md bg-off-white flex flex-col text-left text-lg pr-3 ox-2 pt-2 pb-3 space-y-1 sm:px-3">
                <Link to={'/'}>
                  <button
                    onClick={toggleSidebar}
                    className=" text-black  hover:text-jade px-3 py-2 cursor-pointer rounded-md"
                  >
                    Dashboard
                  </button>
                </Link>
                <Link to={'/scorecards'}>
                  <button
                    onClick={toggleSidebar}
                    className=" text-black  hover:text-jade px-3 py-2 cursor-pointer rounded-md"
                  >
                    Scorecards
                  </button>
                </Link>
                <Link to="/mystats">
                  <button
                    onClick={toggleSidebar}
                    className="text-black hover-text-jade px-3 py-2 cursor-pointer rounded-md"
                  >
                    My Stats
                  </button>
                </Link>
                <Link to={'/friends'}>
                  <button
                    onClick={toggleSidebar}
                    className="text-black hover-text-jade px-3 py-2 cursor-pointer rounded-md"
                  >
                    Friends
                  </button>
                </Link>
                <Link to={'/courses'}>
                  <button
                    onClick={toggleSidebar}
                    className="text-black hover-text-jade px-3 py-2 cursor-pointer rounded-md"
                  >
                    Courses
                  </button>
                </Link>
              </div>
            </div>
          </Transition>
        </div>
      )}
    </nav>
  );
}

Navbar.propTypes = {
  toggleSidebar: PropTypes.func,
  isSideBarOpen: PropTypes.bool,
};
