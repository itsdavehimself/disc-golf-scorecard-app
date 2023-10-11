import { useLogout } from '../../hooks/useLogout';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../../hooks/useAuthContext';

export default function Navbar() {
  const { logout } = useLogout();
  const { user } = useAuthContext();

  const handleClick = () => {
    logout();
  };
  return (
    <header>
      {!user && (
        <div>
          <Link to={'/login'}>
            <button>Login</button>
          </Link>
          <Link to={'/signup'}>
            <button>Signup</button>
          </Link>
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
    </header>
  );
}
