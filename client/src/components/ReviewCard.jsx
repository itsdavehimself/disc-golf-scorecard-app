import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';

export default function ReviewCard({ review, username }) {
  return (
    <section className="flex flex-col justify-between h-auto w-4/5 md:h-64 md:w-80 py-4 px-4 bg-white rounded-xl border-2 border-white-smoke shadow-lg">
      <main className="flex flex-col gap-2">
        <div className="text-jade text-lg">
          <FontAwesomeIcon icon={faStar} />
          <FontAwesomeIcon icon={faStar} />
          <FontAwesomeIcon icon={faStar} />
          <FontAwesomeIcon icon={faStar} />
          <FontAwesomeIcon icon={faStar} />
        </div>
        <div className="text-black italic">&quot;{review}&quot;</div>
      </main>
      <div className="text-gray pt-4 md:pt-0">{username}</div>
    </section>
  );
}

ReviewCard.propTypes = {
  review: PropTypes.string,
  username: PropTypes.string,
};
