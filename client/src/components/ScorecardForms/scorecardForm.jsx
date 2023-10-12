import { useState, useEffect } from 'react';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useNavigate } from 'react-router-dom';

export default function ScorecardForm() {
  const [course, setCourse] = useState(null);
  const [players, setPlayers] = useState([]);
  const [coursesArr, setCoursesArr] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [friends, setFriends] = useState([]);
  const [error, setError] = useState(null);
  const [newScorecardId, setNewScorecardId] = useState(null);
  const { user } = useAuthContext();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // const currentDateTime = new Date();
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
    const value = e.target.value;
    const playerId = value;
    const playerType = e.target.name;
    const playerName = e.target.getAttribute('data-player-name');

    if (e.target.checked) {
      const playerObject = {
        name: playerName,
        type: playerType,
        reference: playerId,
        scores: [],
      };
      setPlayers((prevPlayers) => [...prevPlayers, playerObject]);
    } else {
      setPlayers((prevPlayers) =>
        prevPlayers.filter((player) => player.reference !== playerId),
      );
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

        const [courses, friends] = await Promise.all([
          coursesResponse,
          friendsResponse,
        ]).then((responses) => Promise.all(responses.map((res) => res.json())));

        setCoursesArr(courses);
        setCourse(courses[0]._id);
        setFriends(friends);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
      }
    }

    if (user) {
      fetchData();
    }
  }, [user]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <form className="create" onSubmit={handleSubmit}>
      <h3>Select course</h3>
      <label>Course: </label>
      <select onChange={(e) => setCourse(e.target.value)}>
        {coursesArr.map((courseItem) => (
          <option key={courseItem._id} value={courseItem._id}>
            {courseItem.name}
          </option>
        ))}
      </select>
      <h3>Who&apos;s playing?</h3>
      <div className="users-playing">
        <label>
          <input
            type="checkbox"
            name="User"
            data-player-name={user.user.username}
            id="player1"
            value={user.user._id}
            onChange={handleCheckboxChange}
          ></input>
          {user.user.username}
        </label>
        {friends.map((friend, index) => (
          <label key={friend._id}>
            <input
              type="checkbox"
              name="Friend"
              data-player-name={friend.name}
              id={`player${index + 2}`}
              value={friend._id}
              onChange={handleCheckboxChange}
            />
            {friend.name}
          </label>
        ))}
      </div>
      <button>Start round</button>
    </form>
  );
}
