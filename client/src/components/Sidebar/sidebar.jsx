import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHouse,
  faThumbTack,
  faChartBar,
  faUserGroup,
  faRectangleList,
} from '@fortawesome/free-solid-svg-icons';
import { useLocation } from 'react-router-dom';

export default function Sidebar() {
  const location = useLocation();

  return (
    <div className="bg-white md:w-80">
      <div className="hidden md:flex flex-col pt-16 items-start pl-5 h-full">
        <div className="md:flex flex-col md:sticky top-16 text-lg gap-4">
          <Link to={'/'}>
            <button
              className={`flex gap-2 items-center text-black w-48 py-2 cursor-pointer rounded-lg ${
                location.pathname === '/'
                  ? 'bg-jade text-white font-semibold'
                  : ''
              }`}
            >
              <FontAwesomeIcon icon={faHouse} className="pl-4 w-8" /> Dashboard
            </button>
          </Link>
          <Link to={'/scorecards'}>
            <button
              className={`flex gap-2 items-center text-black w-48 py-2 cursor-pointer rounded-lg ${
                location.pathname === '/scorecards'
                  ? 'bg-jade text-white font-semibold'
                  : ''
              }`}
            >
              <FontAwesomeIcon icon={faRectangleList} className="pl-4 w-8" />{' '}
              Scorecards
            </button>
          </Link>
          <Link to="/mystats">
            <button
              className={`flex gap-2 items-center text-black w-48 py-2 cursor-pointer rounded-lg ${
                location.pathname === '/mystats'
                  ? 'bg-jade text-white font-semibold'
                  : ''
              }`}
            >
              <FontAwesomeIcon icon={faChartBar} className="pl-4 w-8" /> My
              Stats
            </button>
          </Link>
          <Link to={'/friends'}>
            <button
              className={`flex gap-2 items-center text-black w-48 py-2 cursor-pointer rounded-lg ${
                location.pathname === '/friends'
                  ? 'bg-jade text-white font-semibold'
                  : ''
              }`}
            >
              <FontAwesomeIcon icon={faUserGroup} className="pl-4 w-8" />{' '}
              Friends
            </button>
          </Link>
          <Link to={'/courses'}>
            <button
              className={`flex gap-2 items-center text-black w-48 py-2 cursor-pointer rounded-lg ${
                location.pathname === '/courses'
                  ? 'bg-jade text-white font-semibold'
                  : ''
              }`}
            >
              <FontAwesomeIcon icon={faThumbTack} className="pl-4 w-8" />{' '}
              Courses
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
