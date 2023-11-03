import { Link } from 'react-router-dom';

export default function Sidebar() {
  return (
    <div className="bg-white md:w-80">
      <div className="hidden md:flex flex-col pt-16 items-start pl-5 h-full">
        <div className="md:flex flex-col md:sticky top-16">
          <Link to={'/'}>
            <button className=" text-black  hover:text-jade px-3 py-2 cursor-pointer rounded-md">
              Dashboard
            </button>
          </Link>
          <Link to={'/scorecards'}>
            <button className=" text-black  hover:text-jade px-3 py-2 cursor-pointer rounded-md">
              Scorecards
            </button>
          </Link>
          <Link to="/mystats">
            <button className="text-black hover-text-jade px-3 py-2 cursor-pointer rounded-md">
              My Stats
            </button>
          </Link>
          <Link to={'/friends'}>
            <button className="text-black hover-text-jade px-3 py-2 cursor-pointer rounded-md">
              Friends
            </button>
          </Link>
          <Link to={'/courses'}>
            <button className="text-black hover-text-jade px-3 py-2 cursor-pointer rounded-md">
              Courses
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
