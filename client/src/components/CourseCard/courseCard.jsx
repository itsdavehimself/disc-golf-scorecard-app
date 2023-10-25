import PropTypes from 'prop-types';

export default function CourseCard({ course, searchValueInput }) {
  return (
    <div
      className={`p-2 my-2 bg-white rounded-md shadow-sm text-black-olive text-sm hover:cursor-pointer active:bg-honeydew ${
        course.name.toLowerCase().startsWith(searchValueInput.toLowerCase()) ||
        course.city.toLowerCase().startsWith(searchValueInput.toLowerCase()) ||
        course.state.toLowerCase().startsWith(searchValueInput.toLowerCase())
          ? 'block'
          : 'hidden'
      }`}
    >
      <div className={`w-full bg-white`}>
        <div>
          <span className="font-semibold">{course.name}</span> -{' '}
          {course.holes.length} Holes
        </div>
        <div className="text-xs">
          {course.city}, {course.state}
        </div>
      </div>
    </div>
  );
}

CourseCard.propTypes = {
  course: PropTypes.object,
  searchValueInput: PropTypes.string,
};
