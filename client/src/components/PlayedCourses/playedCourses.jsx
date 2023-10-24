import PropTypes from 'prop-types';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';

export default function PlayedCourses({ playedCourses }) {
  const [isCoursesOpen, setIsCoursesOpen] = useState(false);

  return (
    <div>
      <div onClick={() => setIsCoursesOpen(!isCoursesOpen)}>
        Show all played courses
        <FontAwesomeIcon
          icon={faAngleDown}
          className={`${isCoursesOpen && 'rotate-180'}`}
        />
      </div>
      <div className={`text-sm ${isCoursesOpen ? 'h-auto' : 'hidden'}`}>
        {playedCourses.map((course) => (
          <div key={course._id}>
            <div className="font-semibold">{course.name}</div>
            <div>
              {course.city}, {course.state}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

PlayedCourses.propTypes = {
  playedCourses: PropTypes.array,
};
