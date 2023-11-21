import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';

export default function ReviewCard({ review, username }) {
  return (
    <div className="flex flex-col justify-between h-48 w-4/5 md:h-64 md:w-80 py-4 px-4 bg-white rounded-xl border-2 border-white-smoke shadow-lg">
      <div className="flex flex-col gap-2">
        <div className="text-jade text-lg">
          <FontAwesomeIcon icon={faStar} />
          <FontAwesomeIcon icon={faStar} />
          <FontAwesomeIcon icon={faStar} />
          <FontAwesomeIcon icon={faStar} />
          <FontAwesomeIcon icon={faStar} />
        </div>
        <div className="text-black italic">&quot;{review}&quot;</div>
      </div>
      <div className="text-gray">{username}</div>
    </div>
  );
}

ReviewCard.propTypes = {
  review: PropTypes.string,
  username: PropTypes.string,
};
