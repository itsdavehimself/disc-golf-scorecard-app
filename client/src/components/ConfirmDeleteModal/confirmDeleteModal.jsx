import PropTypes from 'prop-types';

export default function ConfirmDeleteModal({
  outsideConfirmDelete,
  setIsConfirmOpen,
  handleConfirmDelete,
  nameForModal,
}) {
  return (
    <div className="flex items-center justify-center absolute z-50 w-screen h-screen bg-modal text-black-olive">
      <div
        ref={outsideConfirmDelete}
        className="relative flex flex-col justify-center gap-6 py-5 px-5 w-2/3 h-max mx-4 bg-off-white rounded-md"
      >
        <p className="text-center">
          Are you sure you want to delete this {nameForModal}?
        </p>
        <div className="grid grid-rows-auto gap-2 justify-center items-center w-full">
          <button
            onClick={handleConfirmDelete}
            className="bg-red py-3 rounded-md text-off-white font-semibold cursor-pointer transition-colors w-48"
          >
            Delete
          </button>
          <button
            className="py-3 rounded-md cursor-pointer transition-colors w-48"
            onClick={() => setIsConfirmOpen(false)}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

ConfirmDeleteModal.propTypes = {
  setIsConfirmOpen: PropTypes.func,
  handleConfirmDelete: PropTypes.func,
  nameForModal: PropTypes.string,
  outsideConfirmDelete: PropTypes.shape({
    current: PropTypes.instanceOf(Element),
  }),
};
