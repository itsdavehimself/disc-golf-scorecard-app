import { useEffect, useState } from 'react';
import { useAuthContext } from '../hooks/useAuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faMagnifyingGlass,
  faAngleRight,
} from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import LoadingScreen from '../components/Loading/loadingScreen';
import Logo from '../components/Logo';

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
    return <LoadingScreen />;
  }

  return (
    <div className="flex flex-col bg-off-white w-full px-3 pt-16 items-center">
      <div className="bg-white rounded-lg shadow-lg mt-3 w-full lg:w-1/2 xl:w-1/3">
        <div className="flex flex-row items-end justify-between pb-2">
          <div className="text-lg pt-3 px-3 text-black font-semibold">
            Your friends
          </div>
          <div className="flex pr-2 text-sm">{friends.length} players</div>
        </div>
        <div className="flex items-center justify-center bg-off-white pl-2 mx-3 rounded-lg">
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            className="text-sm text-black"
          />
          <input
            type="text"
            onChange={(e) => {
              setSearchValueInput(e.target.value);
            }}
            value={searchValueInput}
            placeholder="Search friend"
            className="bg-off-white w-full p-1 outline-none pl-2 rounded-lg"
          ></input>
        </div>
        <div>
          {friends &&
            friends.map((friend) => (
              <div
                onClick={() => openFriend(friend._id)}
                className={`my-2 mx-2 px-3 bg-white rounded-lg text-black text-sm hover:cursor-pointer hover:bg-white-smoke transition-colors group ${
                  friend.name
                    .toLowerCase()
                    .startsWith(searchValueInput.toLowerCase())
                    ? 'block'
                    : 'hidden'
                }`}
                key={friend._id}
              >
                <div className="flex items-center justify-between border-b border-white-smoke pb-3 pt-2">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <FontAwesomeIcon
                        icon={faUser}
                        className=" bg-off-white text-gray px-2 py-2 rounded-full"
                      />
                      <div>
                        <div className="text-black font-semibold">
                          {friend.name}
                        </div>
                        <div className="text-black pr-2 text-xs">
                          {friend.scorecards.length} rounds
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-end pr-2">
                    <FontAwesomeIcon
                      icon={faAngleRight}
                      className="text-md text-gray group-hover:text-jade transition"
                    />
                  </div>
                </div>
              </div>
            ))}
        </div>
        <div className="flex items-center justify-center pb-4">
          <Logo fill="rgba(0,0,0,0.3)" stroke="rgba(0,0,0,0.3)" />
        </div>
      </div>
    </div>
  );
}
