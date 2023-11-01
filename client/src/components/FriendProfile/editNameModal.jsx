export default function EditNameModal({ setIsEditNameOpen }) {
  return (
    <div className="flex items-center justify-center absolute z-50 w-screen h-screen bg-modal text-black">
      <div
        // ref={outsideConfirmDelete}
        className="relative flex flex-col justify-center gap-6 py-5 px-5 w-2/3 h-max mx-4 bg-white rounded-lg shadow-lg"
      >
        <p className="text-center">
          {/* Edit {playerName} */} Edit player name
        </p>
        <div className="grid grid-rows-auto gap-2 justify-center items-center w-full">
          <button
            // onClick={handleConfirmDelete}
            className="bg-jade py-3 rounded-md text-white font-semibold cursor-pointer transition-colors w-48"
          >
            Save
          </button>
          <button
            className="py-3 rounded-md cursor-pointer transition-colors w-48"
            onClick={() => setIsEditNameOpen(false)}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
