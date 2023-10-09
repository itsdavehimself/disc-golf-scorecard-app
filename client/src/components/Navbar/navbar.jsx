import { useLogout } from '../../hooks/useLogout';

export default function Navbar() {
  const { logout } = useLogout();
  const handleClick = () => {
    logout();
  };
  return <button onClick={handleClick}>Logout</button>;
}
