import { useLogout } from '../../hooks/useLogout';
import { Link, useLocation } from 'react-router-dom';
import { useAuthContext } from '../../hooks/useAuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { Transition } from '@headlessui/react';

export default function Navbar() {
  const { logout } = useLogout();
  const { user } = useAuthContext();
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const handleMenu = () => {
    setOpen((prev) => !prev);
  };

  const handleClick = () => {
    logout();
  };

  const isSignUpRoute = location.pathname === '/signup';

  return (
    <nav>
      {!user && (
        <div className="bg-off-white fixed w-full">
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
                    <button className="text-black-olive hover:text-jade px-3 py-2 cursor-pointer rounded-md">
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
                rounded-md text-black-olive hover:text-jade hover-bg-honeydew
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
                    className=" text-black-olive  hover:text-jade px-3 py-2 cursor-pointer rounded-md"
                  >
                    Login
                  </button>
                </Link>
                <Link to={'/login'}>
                  <button
                    onClick={handleMenu}
                    className="text-black-olive hover-text-jade px-3 py-2 cursor-pointer rounded-md"
                  >
                    About
                  </button>
                </Link>
                <Link to={'/login'}>
                  <button
                    onClick={handleMenu}
                    className="text-black-olive hover-text-jade px-3 py-2 cursor-pointer rounded-md"
                  >
                    Repo
                  </button>
                </Link>
                <Link to={'/login'}>
                  <button
                    onClick={handleMenu}
                    className="text-black-olive hover-text-jade px-3 py-2 cursor-pointer rounded-md"
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
        <>
          <Link to="/">
            <button>Home</button>
          </Link>

          <button onClick={handleClick}>Logout</button>
        </>
      )}
    </nav>
  );
}
