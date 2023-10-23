import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

export default function PlayedCourses({ courses, bestRound }) {
  const [playedCourses, setPlayedCourses] = useState([]);
  const [coursesOpen, setCoursesOpen] = useState(false);
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
      <div onClick={() => setCoursesOpen(!coursesOpen)}>
        Show all played courses
      </div>
      <div className={`text-sm ${coursesOpen ? 'h-auto' : 'hidden'}`}>
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
