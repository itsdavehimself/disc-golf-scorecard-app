import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot, faThumbTack } from '@fortawesome/free-solid-svg-icons';

export default function CourseCard({ course, searchValueInput }) {
  return (
    <div
      className={`px-2 p-1 my-2 bg-white rounded-md text-black text-sm ${
        course.name.toLowerCase().startsWith(searchValueInput.toLowerCase()) ||
        course.city.toLowerCase().startsWith(searchValueInput.toLowerCase()) ||
        course.state.toLowerCase().startsWith(searchValueInput.toLowerCase())
          ? 'block'
          : 'hidden'
      }`}
    >
      <div className="w-full bg-white border-b border-white-smoke pb-3 lg:w-80 lg:border-none">
        <div>
          <img
            className="rounded-md h-40 sm:h-96 lg:h-52 w-full object-cover"
            src={course.image}
          ></img>
        </div>
        <div className="flex justify-between items-center pt-1">
          <div className="text-xl font-semibold">{course.name}</div>
          <div className="bg-jade font-semibold text-off-white rounded-2xl px-2 py-0.5">
            {course.rating}
          </div>
        </div>
        <div className="flex text-sm py-1 gap-2">
          <div>
            <FontAwesomeIcon icon={faLocationDot} className="text-gray pr-1" />
            {course.city}, {course.state}
          </div>
          <div>
            <FontAwesomeIcon icon={faThumbTack} className="text-gray pr-1" />
            {course.holes.length} holes
          </div>
        </div>
        <div className="hidden md:block">{course.description}</div>
        <div className="block md:hidden text-xs">{course.blurb}</div>
      </div>
    </div>
  );
}

CourseCard.propTypes = {
  course: PropTypes.object,
  searchValueInput: PropTypes.string,
};
