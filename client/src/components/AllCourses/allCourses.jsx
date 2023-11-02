import { useState, useEffect } from 'react';
import { useAuthContext } from '../../hooks/useAuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import CourseCard from '../CourseCard/courseCard';
import LoadingScreen from '../Loading/loadingScreen';

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
    return <LoadingScreen />;
  }

  return (
    <div className="flex flex-col bg-off-white w-full px-3 pt-20">
      <div className="bg-white rounded-lg mb-2 shadow-lg">
        <div className="font-semibold pb-2 text-lg px-3 pt-3 text-black">
          All courses
        </div>
        <div className="flex items-center justify-center bg-off-white pl-2 mx-3 rounded-lg">
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            className="text-sm text-black"
          />
          <input
            type="text"
            onChange={(e) => {
              setSearchValueInput(e.target.value);
            }}
            value={searchValueInput}
            placeholder="Search course name or location"
            className="bg-off-white w-full p-1 outline-none pl-2 rounded-lg"
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
        <div className="flex items-center justify-center pb-4">Chainseeker</div>
      </div>
    </div>
  );
}
