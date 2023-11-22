import PropTypes from 'prop-types';

export default function AddFriendModal({
  outsideAddFriend,
  handleNewFriendSubmit,
  newFriendNameError,
  handleCancelAddFriend,
  handleFriendNameChange,
}) {
  return (
    <section className="flex items-center justify-center absolute z-50 w-screen h-screen bg-modal">
      <div
        ref={outsideAddFriend}
        className="relative flex flex-col justify-center gap-6 py-5 px-5 w-full h-max mx-4 bg-white rounded-lg shadow-lg md:max-w-xs lg:max-w-xs xl:max-w-xs"
      >
        <header className="flex flex-col">
          <div className="text-xl font-semibold">Add friend</div>
          <p className="text-sm pt-1">
            Create a profile to track scores and statistics for your friend.
          </p>
        </header>
        <form
          className="flex flex-col gap-2 justify-center"
          onSubmit={handleNewFriendSubmit}
        >
          <div className="flex flex-col">
            <label className="text-black text-sm">Player name</label>
            <input
              onChange={handleFriendNameChange}
              type="text"
              className={`${
                newFriendNameError
                  ? 'appearance-none ring-red ring-2'
                  : 'appearance-none border-white-smoke border focus:ring-2 focus:ring-jade'
              } text-black rounded-md shadow-md p-2 focus:outline-none`}
            ></input>
            <div className="h-5">
              {newFriendNameError && (
                <div className="h-max text-sm pt-1 text-vermillion">
                  Please enter a name
                </div>
              )}
            </div>
          </div>
          <button className="bg-jade py-3 rounded-md text-off-white font-semibold hover:cursor-pointer hover:bg-emerald transition-colors">
            Add friend
          </button>
          <button onClick={handleCancelAddFriend} className="py-3">
            Cancel
          </button>
        </form>
      </div>
    </section>
  );
}

AddFriendModal.propTypes = {
  outsideAddFriend: PropTypes.shape({
    current: PropTypes.instanceOf(Element),
  }),
  handleNewFriendSubmit: PropTypes.func,
  newFriendNameError: PropTypes.bool,
  handleCancelAddFriend: PropTypes.func,
  handleFriendNameChange: PropTypes.func,
};
