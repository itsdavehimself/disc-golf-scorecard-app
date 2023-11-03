import PropTypes from 'prop-types';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faThumbTack } from '@fortawesome/free-solid-svg-icons';

export default function PlayedCourses({ playedCourses }) {
  const [isCoursesOpen, setIsCoursesOpen] = useState(false);

  return (
    <div>
      <div
        className="grid grid-cols-3 items-center px-3 hover:cursor-pointer hover:text-jade transition-colors"
        onClick={() => setIsCoursesOpen(!isCoursesOpen)}
      >
        <p className="col-start-1 col-end-3">
          {isCoursesOpen ? 'Hide' : 'Show'} all played courses
        </p>
        <div className="flex justify-end items-center">
          <FontAwesomeIcon
            icon={faAngleDown}
            className={`${isCoursesOpen && 'rotate-180'}`}
          />
        </div>
      </div>
      <div
        className={`text-sm bg-light-gray overflow-y-auto transition-height duration-500 ease-in-out ${
          isCoursesOpen ? 'h-36' : 'hidden'
        }`}
      >
        <div className="px-4 py-0.5">
          {playedCourses.map((course) => (
            <div
              className="flex flex-row gap-2 items-center py-1"
              key={course._id}
            >
              <div>
                <FontAwesomeIcon icon={faThumbTack} />
              </div>
              <div>
                {' '}
                <div className="font-semibold">{course.name}</div>
                <div>
                  {course.city}, {course.state}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

PlayedCourses.propTypes = {
  playedCourses: PropTypes.array,
};
