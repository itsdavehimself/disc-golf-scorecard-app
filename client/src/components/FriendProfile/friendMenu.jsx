import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan, faPenToSquare } from '@fortawesome/free-solid-svg-icons';

export default function FriendMenu({ setIsConfirmOpen, setIsMenuOpen }) {
  return (
    <div className="absolute z-50 top-24 right-8 flex flex-col bg-white rounded-lg shadow-lg h-auto w-40 border border-off-white">
      <button
        onClick={() => setIsMenuOpen(false)}
        className="py-3 flex flex-row items-center gap-2 pl-3"
      >
        <FontAwesomeIcon icon={faPenToSquare} />
        Edit name
      </button>
      <button
        className="py-3 flex flex-row items-center gap-2 pl-3"
        onClick={() => {
          setIsMenuOpen(false);
          setIsConfirmOpen(true);
        }}
      >
        <FontAwesomeIcon icon={faTrashCan} />
        Delete friend
      </button>
    </div>
  );
}

FriendMenu.propTypes = {
  setIsConfirmOpen: PropTypes.func,
  setIsMenuOpen: PropTypes.func,
};
