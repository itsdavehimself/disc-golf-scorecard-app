import { useState, useEffect, useRef } from 'react';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faAngleDown,
  faMagnifyingGlass,
  faUser,
} from '@fortawesome/free-solid-svg-icons';

export default function ScorecardForm() {
  const [course, setCourse] = useState(null);
  const [courseName, setCourseName] = useState(null);
  const [courseCity, setCourseCity] = useState('');
  const [courseState, setCourseState] = useState('');
  const [courseHoles, setCourseHoles] = useState('');
  const [players, setPlayers] = useState([]);
  const [coursesArr, setCoursesArr] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [friends, setFriends] = useState([]);
  const [searchValueInput, setSearchValueInput] = useState('');
  const [userScorecards, setUserScorecards] = useState(null);

  const [isSelectOpen, setIsSelectOpen] = useState(false);

  const [error, setError] = useState(null);
  const [newScorecardId, setNewScorecardId] = useState(null);
  const { user } = useAuthContext();
  const navigate = useNavigate();

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
        score: null,
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
      setNewScorecardId(scorecardId);
      console.log('new scorecard added');
      setCourse(null);
      setPlayers([]);
      navigate(`/scorecard/${scorecardId}`);
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
        target.setAttribute('data-player-checked', 'true');
      } else {
        setPlayers((prevPlayers) =>
          prevPlayers.filter((player) => player.reference !== playerId),
        );
        target.setAttribute('data-player-checked', 'false');
      }

      console.log(players);
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
        setFriends(friends);
        setUserScorecards(scorecards);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
      }
    }

    if (user) {
      fetchData();
    }
  }, [user]);

  const dropDownRef = useRef();

  useEffect(() => {
    const dropDownHandler = (e) => {
      if (!dropDownRef.current.contains(e.target)) {
        setIsSelectOpen(false);
      }
    };

    document.addEventListener('mousedown', dropDownHandler);

    return () => {
      document.removeEventListener('mousedown', dropDownHandler);
    };
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="pt-16 w-full text-black-olive px-4">
      <form onSubmit={handleSubmit}>
        <div
          ref={dropDownRef}
          className="relative font-md w-full hover:cursor-pointer"
        >
          <div
            className="bg-honeydew w-full p-2 flex items-center justify-between rounded-md h-12"
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
            className={`bg-honeydew overflow-y-auto mt-2 rounded-md shadow-md ${
              isSelectOpen
                ? 'max-h-60 w-full absolute'
                : 'max-h-0 w-full absolute'
            }`}
          >
            <div className="flex items-center justify-center bg-honeydew pl-2 sticky top-0">
              <FontAwesomeIcon icon={faMagnifyingGlass} className="text-sm" />
              <input
                type="text"
                onChange={(e) => {
                  setSearchValueInput(e.target.value);
                }}
                value={searchValueInput}
                placeholder="Search course"
                className="bg-honeydew w-full p-1 outline-none pl-2"
              ></input>
            </div>
            {coursesArr.map((courseItem) => (
              <li
                className={`hover:bg-emerald hover:cursor-pointer text-sm px-1 py-2 border-t border-off-white ${
                  courseItem.name === courseName && 'bg-emerald'
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
        <h3>Who&apos;s playing?</h3>
        <div className="users-playing flex flex-col gap-2">
          <div
            data-player-name={user.user.username}
            data-player-id="player1"
            data-player-value={user.user._id}
            data-player-type="User"
            data-player-checked="false"
            onClick={handleCheckboxChange}
          >
            <div
              className={`flex items-center justify-between px-2 py-3 text-sm hover:cursor-pointer rounded-md ${
                players.some((player) => player.reference === user.user._id)
                  ? 'bg-emerald'
                  : 'bg-honeydew'
              }`}
            >
              <div className="flex items-center gap-2">
                <div className="text-xs">
                  <FontAwesomeIcon
                    icon={faUser}
                    className="bg-jade p-1.5 rounded-full font-xs"
                  />
                </div>
                <div className="font-semibold">{user.user.username}</div>
              </div>
              <div className="text-xs">
                {userScorecards.length}{' '}
                {userScorecards.length === 1 ? 'Round Played' : 'Rounds Played'}
              </div>
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
                className={`flex items-center justify-between px-2 py-3 text-sm hover:cursor-pointer rounded-md ${
                  players.some((player) => player.reference === friend._id)
                    ? 'bg-emerald'
                    : 'bg-honeydew'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className="text-xs">
                    <FontAwesomeIcon
                      icon={faUser}
                      className="bg-jade p-1.5 rounded-full font-xs"
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
            </div>
          ))}
        </div>
        <button>Start round</button>
      </form>
    </div>
  );
}
