import { useState, useEffect } from 'react';
import { useAuthContext } from '../hooks/useAuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import CourseCard from '../components/CourseCard/courseCard';
import LoadingScreen from '../components/Loading/loadingScreen';
import Logo from '../components/Logo/Logo';

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
        <div className="flex flex-col justify-center items-center pt-4">
          <div className="flex items-center justify-center bg-off-white pl-2 rounded-lg w-80 md:w-2/3 lg:w-1/2 xl:w-1/3 lg:mb-4">
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
          <div className="flex flex-col lg:flex-row lg:flex-wrap lg:justify-center lg:gap-6">
            {courses &&
              courses.map((course) => (
                <CourseCard
                  key={course._id}
                  course={course}
                  searchValueInput={searchValueInput}
                />
              ))}
          </div>
          <div className="flex items-center justify-center pb-4">
            <Logo fill="rgba(0,0,0,0.3)" stroke="rgba(0,0,0,0.3)" />
          </div>
        </div>
      </div>
    </div>
  );
}
