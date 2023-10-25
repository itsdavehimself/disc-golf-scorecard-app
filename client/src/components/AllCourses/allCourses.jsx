import { useState, useEffect } from 'react';
import { useAuthContext } from '../../hooks/useAuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import CourseCard from '../CourseCard/courseCard';

export default function AllCourses() {
  const [searchValueInput, setSearchValueInput] = useState('');
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const { user } = useAuthContext();

  useEffect(() => {
    const fetchCourses = async () => {
      const response = await fetch('http://localhost:8080/api/courses');
      const json = await response.json();

      if (response.ok) {
        setCourses(json);
        setIsLoading(false);
      }
    };

    if (user) {
      fetchCourses();
    }
  }, [user]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col bg-off-white w-full px-4 pt-20">
      <div className="flex items-center justify-center bg-honeydew pl-2 rounded-md">
        <FontAwesomeIcon
          icon={faMagnifyingGlass}
          className="text-sm text-black-olive"
        />
        <input
          type="text"
          onChange={(e) => {
            setSearchValueInput(e.target.value);
          }}
          value={searchValueInput}
          placeholder="Search course name or location"
          className="bg-honeydew w-full p-1 outline-none pl-2"
        ></input>
      </div>
      <div>
        {courses &&
          courses.map((course) => (
            <CourseCard
              key={course._id}
              course={course}
              searchValueInput={searchValueInput}
            />
          ))}
      </div>
    </div>
  );
}
