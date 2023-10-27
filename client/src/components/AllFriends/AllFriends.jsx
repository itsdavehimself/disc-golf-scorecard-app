import { useEffect, useState } from 'react';
import { useAuthContext } from '../../hooks/useAuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

export default function AllFriends() {
  const [friends, setFriends] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchValueInput, setSearchValueInput] = useState('');

  const { user } = useAuthContext();

  const navigate = useNavigate();

  const openFriend = (friendId) => {
    navigate(`/friends/${friendId}`);
  };

  useEffect(() => {
    const fetchFriends = async () => {
      const response = await fetch('http://localhost:8080/api/friends', {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      const json = await response.json();

      if (response.ok) {
        json.sort(
          (friendA, friendB) =>
            friendB.scorecards.length - friendA.scorecards.length,
        );

        setFriends(json);
        setIsLoading(false);
      }
    };

    if (user) {
      fetchFriends();
    }
  }, [user]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col bg-off-white w-full px-4 pt-16">
      <div className="flex flex-row items-center justify-between pt-4 pb-2">
        <div className="flex text-sm text-black-olive items-center font-semibold">
          Your friends
        </div>
        <div className="text-sm">{friends.length} players</div>
      </div>
      <div className="flex items-center justify-center bg-honeydew pl-2 sticky top-0">
        <FontAwesomeIcon
          icon={faMagnifyingGlass}
          className="text-sm text-black-olive"
        />
        <input
          type="text"
          onChange={(e) => {
            setSearchValueInput(e.target.value);
          }}
          value={searchValueInput}
          placeholder="Search friend"
          className="bg-honeydew w-full p-1 outline-none pl-2"
        ></input>
      </div>
      <div>
        {friends &&
          friends.map((friend) => (
            <div
              onClick={() => openFriend(friend._id)}
              className={`p-2 my-2 bg-white rounded-md shadow-sm text-black-olive text-sm hover:cursor-pointer active:bg-honeydew ${
                friend.name
                  .toLowerCase()
                  .startsWith(searchValueInput.toLowerCase())
                  ? 'block'
                  : 'hidden'
              }`}
              key={friend._id}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon
                    icon={faUser}
                    className="text-xs bg-jade text-off-white px-2 py-2 rounded-full"
                  />
                  <div className="text-black-olive font-semibold">
                    {friend.name}
                  </div>
                </div>
                <div className="text-black-olive pr-2">
                  {friend.scorecards.length} rounds
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
