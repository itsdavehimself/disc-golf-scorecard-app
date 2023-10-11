import { useState, useEffect } from 'react';

export default function ScorecardForm() {
  const [course, setCourse] = useState('');
  const [coursesArr, setCoursesArr] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchCourses() {
      try {
        const response = await fetch('http://localhost:8080/api/courses');
        if (response.ok) {
          const courses = await response.json();
          setCoursesArr(courses);
          setIsLoading(false);
        }
      } catch (error) {
        throw Error(error);
      }
    }
    fetchCourses();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <form className="create">
      <h3>Select course</h3>
      <label>Course: </label>
      <select>
        {coursesArr.map((courseItem) => (
          <option key={courseItem._id} value={courseItem.name}>
            {courseItem.name}
          </option>
        ))}
      </select>
      <h3>Who&apos;s playing?</h3>
    </form>
  );
}
