import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';

export default function PlayedCourses({ courses, bestRound }) {
  const [playedCourses, setPlayedCourses] = useState([]);
  const [isCoursesOpen, setIsCoursesOpen] = useState(false);
  const [bestRoundCourseName, setBestRoundCourseName] = useState('');

  useEffect(() => {
    async function fetchCourses() {
      try {
        const response = await fetch(`http://localhost:8080/api/courses/`);
        if (response.ok) {
          const courseData = await response.json();

          // Find the matching course
          const matchingCourse = courseData.find(
            (course) => course._id === bestRound.course,
          );

          if (matchingCourse) {
            setBestRoundCourseName(matchingCourse);
          }

          const matchingCourses = courseData.filter((course) =>
            courses.includes(course._id),
          );

          setPlayedCourses(matchingCourses);
        }
      } catch (error) {
        throw Error(error);
      }
    }
    fetchCourses();
  }, [courses, bestRound.course]);

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
      <div>
        <div>Best round</div>
        <span className="font-semibold">
          {bestRound.difference === 0
            ? 'E'
            : bestRound.difference > 0
            ? `+${bestRound.difference}`
            : bestRound.difference}
        </span>{' '}
        at {bestRoundCourseName.name} {bestRoundCourseName.city},{' '}
        {bestRoundCourseName.state}
      </div>
    </div>
  );
}

PlayedCourses.propTypes = {
  courses: PropTypes.array,
  bestRound: PropTypes.object,
};
