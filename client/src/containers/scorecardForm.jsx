import { useState, useEffect, useRef } from 'react';
import { useAuthContext } from '../hooks/useAuthContext';
import { useFriendListContext } from '../hooks/useFriendContext';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faAngleDown,
  faCheck,
  faMagnifyingGlass,
  faUser,
  faUserPlus,
} from '@fortawesome/free-solid-svg-icons';
import LoadingScreen from '../components/Loading/loadingScreen';

let useClickOutside = (handler) => {
  const domNode = useRef();

  useEffect(() => {
    const outsideHandler = (e) => {
      if (domNode.current && !domNode.current.contains(e.target)) {
        handler();
      }
    };

    document.addEventListener('mousedown', outsideHandler);

    return () => {
      document.removeEventListener('mousedown', outsideHandler);
    };
  });

  return domNode;
};

export default function ScorecardForm() {
  const { friends, dispatch } = useFriendListContext();
  const [course, setCourse] = useState(null);
  const [courseName, setCourseName] = useState(null);
  const [courseCity, setCourseCity] = useState('');
  const [courseState, setCourseState] = useState('');
  const [courseHoles, setCourseHoles] = useState('');
  const [players, setPlayers] = useState([]);
  const [coursesArr, setCoursesArr] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchValueInput, setSearchValueInput] = useState('');
  const [userScorecards, setUserScorecards] = useState(null);
  const [addFriendOpen, setAddFriendOpen] = useState(false);
  const [newFriendName, setNewFriendName] = useState(null);
  const [newFriendNameError, setNewFriendNameError] = useState(false);
  const [playerBackgroundColors, setPlayerBackgroundColors] = useState({});
  const [isSelectOpen, setIsSelectOpen] = useState(false);

  const [error, setError] = useState(null);
  const { user } = useAuthContext();
  const navigate = useNavigate();

  const handleFriendNameChange = (e) => {
    const friendNameInput = e.target.value;
    setNewFriendName(friendNameInput);
    if (friendNameInput === '') {
      setNewFriendNameError(true);
    } else {
      setNewFriendNameError(false);
    }
  };

  const handleNewFriendSubmit = async (e) => {
    e.preventDefault();
    if (!newFriendName || newFriendName === '') {
      setNewFriendNameError(true);
      return;
    }
    if (newFriendNameError) {
      return;
    }
    const newFriendResponse = await fetch(
      `http://localhost:8080/api/friends/`,
      {
        method: 'POST',
        body: JSON.stringify({
          name: newFriendName,
        }),
        headers: {
          Authorization: `Bearer ${user.token}`,
          'Content-Type': 'application/json',
        },
      },
    );
    const json = await newFriendResponse.json();

    if (!newFriendResponse.ok) {
      setError(json.error);
    }

    if (newFriendResponse.ok) {
      dispatch({ type: 'CREATE_FRIEND', payload: json });
      setAddFriendOpen(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const currentDateTime = new Date();

    const courseDetailsResponse = await fetch(
      `http://localhost:8080/api/courses/${course}`,
    );
    const courseDetails = await courseDetailsResponse.json();

    if (!courseDetailsResponse.ok) {
      setError(courseDetails.error);
      return;
    }

    const selectedCourse = courseDetails.course;

    const playerObjects = players.map((player) => {
      const playerScores = selectedCourse.holes.map((hole) => ({
        holeNumber: hole.holeNumber,
        holePar: hole.par,
        score: 0,
      }));

      return {
        name: player.name,
        type: player.type,
        reference: player.reference,
        scores: playerScores,
      };
    });

    const scorecard = {
      course,
      date: currentDateTime,
      startTime: currentDateTime,
      players: playerObjects,
    };

    const response = await fetch('http://localhost:8080/api/scorecards', {
      method: 'POST',
      body: JSON.stringify(scorecard),
      headers: {
        Authorization: `Bearer ${user.token}`,
        'Content-Type': 'application/json',
      },
    });
    const json = await response.json();

    if (!response.ok) {
      setError(json.error);
    }

    if (response.ok) {
      setError(null);
      const scorecardId = json._id;
      const friendsPlaying = players.filter(
        (player) => player.type === 'Friend',
      );
      if (friendsPlaying.length > 0) {
        await Promise.all(
          friendsPlaying.map(async (friend) => {
            const friendResponse = await fetch(
              `http://localhost:8080/api/friends/${friend.reference}`,
              {
                method: 'PUT',
                body: JSON.stringify({
                  scorecards: [json._id],
                }),
                headers: {
                  Authorization: `Bearer ${user.token}`,
                  'Content-Type': 'application/json',
                },
              },
            );
            if (!friendResponse.ok) {
              setError(json.error);
            }

            if (friendResponse.ok) {
              setCourse(null);
              setPlayers([]);
              navigate(`/scorecards/${scorecardId}`);
            }
          }),
        );
      } else {
        setCourse(null);
        setPlayers([]);
        navigate(`/scorecards/${scorecardId}`);
      }
    }
  };

  const handleCheckboxChange = (e) => {
    const target = e.target.closest(
      '[data-player-type="User"], [data-player-type="Friend"]',
    );

    if (target) {
      const value = target.getAttribute('data-player-value');
      const playerId = value;
      const playerType = target.getAttribute('data-player-type');
      const playerName = target.getAttribute('data-player-name');

      const playerObject = {
        name: playerName,
        type: playerType,
        reference: playerId,
        scores: [],
      };

      const isChecked = target.getAttribute('data-player-checked') === 'true';

      if (!isChecked) {
        setPlayers((prevPlayers) => [...prevPlayers, playerObject]);
        setPlayerBackgroundColors((prevColors) => ({
          ...prevColors,
          [playerId]: 'bg-off-white',
        }));
        target.setAttribute('data-player-checked', 'true');
      } else {
        setPlayers((prevPlayers) =>
          prevPlayers.filter((player) => player.reference !== playerId),
        );
        setPlayerBackgroundColors((prevColors) => ({
          ...prevColors,
          [playerId]: 'bg-white',
        }));
        target.setAttribute('data-player-checked', 'false');
      }
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const coursesResponse = fetch('http://localhost:8080/api/courses');
        const friendsResponse = fetch('http://localhost:8080/api/friends', {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        const scorecardResponse = await fetch(
          'http://localhost:8080/api/scorecards',
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          },
        );

        const [courses, friends, scorecards] = await Promise.all([
          coursesResponse,
          friendsResponse,
          scorecardResponse,
        ]).then((responses) => Promise.all(responses.map((res) => res.json())));

        setCoursesArr(courses);
        setCourse(courses[0]._id);
        dispatch({
          type: 'SET_FRIENDS',
          payload: friends.sort(
            (friendA, friendB) =>
              friendB.scorecards.length - friendA.scorecards.length,
          ),
        });
        setUserScorecards(scorecards);
        setPlayers([
          {
            name: user.user.username,
            type: 'User',
            reference: user.user._id,
            scores: [],
          },
        ]);
        setPlayerBackgroundColors({
          [user.user._id]: 'bg-off-white',
        });
        setIsLoading(false);
      } catch (error) {
        console.error(error);
      }
    }

    if (user) {
      fetchData();
    }
  }, [user, dispatch]);

  const outsideDropDown = useClickOutside(() => {
    setIsSelectOpen(false);
  });

  const outsideAddFriend = useClickOutside(() => {
    setAddFriendOpen(false);
    setNewFriendName(null);
    setNewFriendNameError(false);
  });

  const handleCancelAddFriend = (e) => {
    e.preventDefault();
    setAddFriendOpen(false);
    setNewFriendName(null);
    setNewFriendNameError(false);
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <>
      {addFriendOpen && (
        <div className="flex items-center justify-center absolute z-50 w-screen h-screen bg-modal">
          <div
            ref={outsideAddFriend}
            className="relative flex flex-col justify-center gap-6 py-5 px-5 w-full h-max mx-4 bg-white rounded-lg shadow-lg md:max-w-xs lg:max-w-xs xl:max-w-xs"
          >
            <div className="flex flex-col">
              <div className="text-xl font-semibold">Add friend</div>
              <p className="text-sm pt-1">
                Create a profile to track scores and statistics for your friend.
              </p>
            </div>
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
              </div>
              <button className="bg-jade py-3 rounded-md text-off-white font-semibold hover:cursor-pointer hover:bg-emerald transition-colors">
                Add friend
              </button>
              <button onClick={handleCancelAddFriend} className="py-3">
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
      <div className="flex flex-col bg-off-white w-full px-3 text-black pt-16 items-center">
        <div className="bg-white rounded-lg shadow-lg px-3 py-3 mt-3 w-full lg:w-1/2 xl:w-1/3">
          <form onSubmit={handleSubmit}>
            <div
              ref={outsideDropDown}
              className="relative font-md w-full hover:cursor-pointer"
            >
              <div
                className="bg-off-white w-full p-2 flex items-center justify-between rounded-md h-12"
                onClick={() => setIsSelectOpen(!isSelectOpen)}
              >
                {courseName ? (
                  <div>
                    <div className="text-sm">
                      <span className="font-semibold">{courseName}</span> -{' '}
                      {courseHoles} holes
                    </div>
                    <div className="text-xs">
                      {courseCity}, {courseState}
                    </div>
                  </div>
                ) : (
                  'Select course'
                )}
                <FontAwesomeIcon
                  icon={faAngleDown}
                  className={`${isSelectOpen && 'rotate-180'}`}
                />
              </div>
              <input type="hidden" />

              <ul
                className={`bg-off-white overflow-y-auto mt-2 rounded-md shadow-md ${
                  isSelectOpen
                    ? 'max-h-60 w-full absolute'
                    : 'max-h-0 w-full absolute'
                }`}
              >
                <div className="flex items-center justify-center bg-off-white pl-2 sticky top-0">
                  <FontAwesomeIcon
                    icon={faMagnifyingGlass}
                    className="text-sm"
                  />
                  <input
                    type="text"
                    onChange={(e) => {
                      setSearchValueInput(e.target.value);
                    }}
                    value={searchValueInput}
                    placeholder="Search course"
                    className="bg-off-white w-full p-1 outline-none pl-2"
                  ></input>
                </div>
                {coursesArr.map((courseItem) => (
                  <li
                    className={`hover:bg-jade hover:text-white hover:cursor-pointer text-sm px-1 py-2 border-t border-off-white ${
                      courseItem.name === courseName &&
                      'bg-washed-jade text-white'
                    } ${
                      courseItem.name
                        .toLowerCase()
                        .startsWith(searchValueInput.toLowerCase()) ||
                      courseItem.city
                        .toLowerCase()
                        .startsWith(searchValueInput.toLowerCase())
                        ? 'block'
                        : 'hidden'
                    }`}
                    key={courseItem._id}
                    onClick={() => {
                      setCourse(courseItem._id);
                      setCourseName(courseItem.name);
                      setCourseCity(courseItem.city);
                      setCourseState(courseItem.state);
                      setCourseHoles(courseItem.holes.length);
                      setSearchValueInput('');
                      setIsSelectOpen(!isSelectOpen);
                    }}
                  >
                    <div>
                      <span className="font-semibold">{courseItem.name}</span> -{' '}
                      {courseItem.holes.length} holes
                    </div>
                    <div className="text-xs">
                      {courseItem.city}, {courseItem.state}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex items-center justify-between my-4">
              <h3 className="font-semibold">Who&apos;s playing?</h3>
              <div
                onClick={() => {
                  setAddFriendOpen(!addFriendOpen);
                }}
                className="flex items-center gap-2 text-jade border border-jade py-2 px-2 rounded-md hover:cursor-pointer hover:bg-jade hover:text-white transition-colors"
              >
                <FontAwesomeIcon icon={faUserPlus} />{' '}
                <span className="text-xs font-semibold">Add friend</span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div
                data-player-name={user.user.username}
                data-player-id="player1"
                data-player-value={user.user._id}
                data-player-type="User"
                data-player-checked="true"
                onClick={handleCheckboxChange}
              >
                <div
                  className={`grid grid-cols-10 px-2 py-3 text-sm hover:cursor-pointer rounded-lg hover-bg-off-white transition-colors ${
                    playerBackgroundColors[user.user._id]
                  }`}
                >
                  <div className="flex items-center justify-between col-start-1 col-end-10">
                    <div className="flex flex-row items-center gap-2">
                      <div className="text-xs">
                        <FontAwesomeIcon
                          icon={faUser}
                          className="bg-off-white border border-white p-1.5 rounded-full font-xs text-gray"
                        />
                      </div>
                      <div className="font-semibold">{user.user.username}</div>
                    </div>
                    <div className="text-xs">
                      {userScorecards.length}{' '}
                      {userScorecards.length === 1
                        ? 'Round Played'
                        : 'Rounds Played'}
                    </div>
                  </div>
                  {players.some(
                    (player) => player.reference === user.user._id,
                  ) ? (
                    <div className="flex items-center justify-center">
                      <FontAwesomeIcon icon={faCheck} />
                    </div>
                  ) : null}
                </div>
              </div>
              {friends.map((friend, index) => (
                <div
                  key={friend._id}
                  data-player-name={friend.name}
                  data-player-id={`players${index + 2}`}
                  data-player-value={friend._id}
                  data-player-type="Friend"
                  data-player-checked="false"
                  onClick={handleCheckboxChange}
                >
                  <div
                    className={`grid grid-cols-10 px-2 py-3 text-sm hover:cursor-pointer rounded-lg hover-bg-off-white transition-colors ${
                      playerBackgroundColors[friend._id]
                    }`}
                  >
                    <div className="flex items-center justify-between col-start-1 col-end-10">
                      <div className="flex items-center gap-2">
                        <div className="text-xs">
                          <FontAwesomeIcon
                            icon={faUser}
                            className="bg-off-white border border-white p-1.5 rounded-full font-xs text-gray"
                          />
                        </div>
                        <div className="font-semibold">{friend.name}</div>
                      </div>
                      <div className="text-xs">
                        {friend.scorecards.length}{' '}
                        {friend.scorecards.length === 1
                          ? 'Round Played'
                          : 'Rounds Played'}
                      </div>
                    </div>
                    {players.some(
                      (player) => player.reference === friend._id,
                    ) ? (
                      <div className="flex items-center justify-center">
                        <FontAwesomeIcon icon={faCheck} />
                      </div>
                    ) : null}
                  </div>
                </div>
              ))}
              <button
                disabled={players.length === 0}
                className={`w-full bg-jade py-2 px-3 rounded-md text-off-white font-semibold cursor-pointer hover:bg-emerald transition-colors ${
                  players.length === 0
                    ? 'bg-washed-jade text-disabled-font-jade'
                    : null
                }`}
              >
                Start round
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
