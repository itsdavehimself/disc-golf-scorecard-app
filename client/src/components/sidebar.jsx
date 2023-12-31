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
    <section className="bg-white md:w-80">
      <nav className="hidden md:flex flex-col pt-16 items-start pl-5 h-full">
        <div className="md:flex flex-col md:sticky top-16 text-lg gap-4">
          <Link to={'/'}>
            <button
              className={`flex gap-2 items-center text-black w-48 py-2 cursor-pointer rounded-lg transition-colors ${
                location.pathname === '/'
                  ? 'bg-jade text-white font-semibold hover:bg-jade'
                  : 'hover:bg-off-white'
              }`}
            >
              <FontAwesomeIcon icon={faHouse} className="pl-4 w-8" /> Dashboard
            </button>
          </Link>
          <Link to={'/scorecards'}>
            <button
              className={`flex gap-2 items-center text-black w-48 py-2 cursor-pointer rounded-lg transition-colors ${
                location.pathname === '/scorecards'
                  ? 'bg-jade text-white font-semibold hover:bg-jade'
                  : 'hover:bg-off-white'
              }`}
            >
              <FontAwesomeIcon icon={faRectangleList} className="pl-4 w-8" />{' '}
              Scorecards
            </button>
          </Link>
          <Link to="/mystats">
            <button
              className={`flex gap-2 items-center text-black w-48 py-2 cursor-pointer rounded-lg transition-colors ${
                location.pathname === '/mystats'
                  ? 'bg-jade text-white font-semibold hover:bg-jade'
                  : 'hover:bg-off-white'
              }`}
            >
              <FontAwesomeIcon icon={faChartBar} className="pl-4 w-8" /> My
              Stats
            </button>
          </Link>
          <Link to={'/friends'}>
            <button
              className={`flex gap-2 items-center text-black w-48 py-2 cursor-pointer rounded-lg transition-colors ${
                location.pathname === '/friends'
                  ? 'bg-jade text-white font-semibold hover:bg-jade'
                  : 'hover:bg-off-white'
              }`}
            >
              <FontAwesomeIcon icon={faUserGroup} className="pl-4 w-8" />{' '}
              Friends
            </button>
          </Link>
          <Link to={'/courses'}>
            <button
              className={`flex gap-2 items-center text-black w-48 py-2 cursor-pointer rounded-lg hover:bg-off-white transition-colors ${
                location.pathname === '/courses'
                  ? 'bg-jade text-white font-semibold hover:bg-jade'
                  : ''
              }`}
            >
              <FontAwesomeIcon icon={faThumbTack} className="pl-4 w-8" />{' '}
              Courses
            </button>
          </Link>
        </div>
      </nav>
    </section>
  );
}
