import { useState } from 'react';
import PropTypes from 'prop-types';
import { useAuthContext } from '../../hooks/useAuthContext';

export default function EditNameModal({
  setIsEditNameOpen,
  friend,
  friendName,
  setFriendName,
}) {
  const [newFriendName, setNewFriendName] = useState(friendName);
  const [newFriendNameError, setNewFriendNameError] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuthContext();

  const handleFriendNameChange = (e) => {
    const friendNameInput = e.target.value;
    setNewFriendName(friendNameInput);
    if (friendNameInput === '') {
      setNewFriendNameError(true);
    } else {
      setNewFriendNameError(false);
    }
  };

  const handleSubmitNewName = async (e) => {
    e.preventDefault();

    try {
      const newNameResponse = await fetch(
        `http://localhost:8080/api/friends/${friend._id}`,
        {
          method: 'PUT',
          body: JSON.stringify({
            newName: newFriendName,
          }),
          headers: {
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      const namesInScorecardsResponse = await fetch(
        `http://localhost:8080/api/scorecards`,
        {
          method: 'PATCH',
          body: JSON.stringify({
            newName: newFriendName,
            friendId: friend._id,
          }),
          headers: {
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'application/json',
          },
        },
      );
      const [friendUpdate, scorecardUpdate] = await Promise.all([
        newNameResponse,
        namesInScorecardsResponse,
      ]).then((responses) => Promise.all(responses.map((res) => res.json())));

      setFriendName(newFriendName);
      setIsEditNameOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex items-center justify-center absolute z-50 w-screen h-screen bg-modal text-black">
      <div className="relative flex flex-col justify-center gap-6 py-5 px-5 w-4/5 h-max mx-4 bg-white rounded-lg shadow-lg">
        <p className="text-center">Edit player name</p>
        <form
          className="flex flex-col items-center justify-center"
          onSubmit={handleSubmitNewName}
        >
          <input
            onChange={handleFriendNameChange}
            type="text"
            value={newFriendName}
            className={`${
              newFriendNameError
                ? 'ring-red ring-2'
                : 'border-white-smoke border focus:ring-2 focus:ring-jade'
            } text-black rounded-md shadow-md p-2 focus:outline-none`}
          ></input>
          <div className="h-5">
            {newFriendNameError && (
              <div className="h-max text-sm pt-1 text-vermillion">
                Please enter a name
              </div>
            )}
          </div>
          <button className="bg-jade py-3 rounded-md text-white font-semibold cursor-pointer transition-colors w-48 mt-2">
            Save
          </button>
          <button
            className="py-3 rounded-md cursor-pointer transition-colors w-48"
            onClick={() => setIsEditNameOpen(false)}
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}

EditNameModal.propTypes = {
  setIsEditNameOpen: PropTypes.func,
  friend: PropTypes.object,
  friendName: PropTypes.string,
  setFriendName: PropTypes.func,
};
