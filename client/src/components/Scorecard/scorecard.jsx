import { useParams } from 'react-router-dom';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useEffect, useState } from 'react';
import { format, parseISO } from 'date-fns';

export default function Scorecard() {
  const { id } = useParams();
  const { user } = useAuthContext();
  const [isLoading, setIsLoading] = useState(true);
  const [courseExists, setCourseExists] = useState(false);
  const [courseName, setCourseName] = useState('');
  const [date, setDate] = useState(null);
  const [holes, setHoles] = useState([]);
  const [numberOfHoles, setNumberOfHoles] = useState(null);
  const [startTime, setStartTime] = useState('');
  const [location, setLocation] = useState('');
  const [players, setPlayers] = useState([]);
  const [playerScores, setPlayerScores] = useState({});
  const [scorecardId, setScorecardId] = useState(null);
  const [error, setError] = useState(null);

  const handleInputChange = (event, playerId, holeNumber) => {
    let value = event.target.value;

    if (value === '' || isNaN(value)) {
      value = 0;
    } else {
      value = parseInt(value, 10);
    }

    const updatedPlayerScores = { ...playerScores };

    if (!updatedPlayerScores[playerId]) {
      updatedPlayerScores[playerId] = [];
    }

    updatedPlayerScores[playerId][holeNumber - 1] = parseInt(value, 10);
    setPlayerScores(updatedPlayerScores);
  };

  const createPlayersWithScoresObj = () => {
    const holeInfoArray = holes.map((hole) => ({
      holeNumber: hole.holeNumber,
      par: hole.par,
    }));

    const playerScoresArray = Object.keys(playerScores).map((reference) => ({
      reference,
      scores: playerScores[reference],
    }));

    const playersWithScores = playerScoresArray.map((player) => ({
      reference: player.reference,
      scores: holeInfoArray.map((holeData, index) => ({
        holeNumber: holeData.holeNumber,
        par: holeData.par,
        score: player.scores[index],
      })),
    }));

    return {
      players: playersWithScores,
    };
  };

  const handleScorecardSubmit = async (e) => {
    e.preventDefault();

    const updatedScores = createPlayersWithScoresObj();

    const saveScorecardResponse = await fetch(
      `http://localhost:8080/api/scorecards/${scorecardId}`,
      {
        method: 'PATCH',
        body: JSON.stringify(updatedScores),
        headers: {
          Authorization: `Bearer ${user.token}`,
          'Content-Type': 'application/json',
        },
      },
    );
    const json = await saveScorecardResponse.json();

    if (!saveScorecardResponse.ok) {
      setError(json.error);
    }

    if (saveScorecardResponse.ok) {
      return;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const scorecardResponse = await fetch(
        `http://localhost:8080/api/scorecards/${id}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        },
      );
      const scorecardJson = await scorecardResponse.json();

      if (scorecardJson.scorecard.length < 1) {
        setIsLoading(false);
        return;
      }

      const courseResponse = await fetch(
        `http://localhost:8080/api/courses/${scorecardJson.scorecard[0].course}`,
      );
      const courseJson = await courseResponse.json();

      if (scorecardResponse.ok && courseResponse.ok) {
        if (scorecardJson.scorecard.length === 1) {
          setScorecardId(scorecardJson.scorecard[0]._id);
          setCourseExists(true);
          const scorecardDate = parseISO(scorecardJson.scorecard[0].date);
          const formattedDate = format(scorecardDate, 'MMM d, yyyy');
          const formattedTime = format(scorecardDate, 'p');
          setDate(formattedDate);
          setStartTime(formattedTime);
          setCourseName(courseJson.course.name);
          const courseCity = courseJson.course.city;
          const courseState = courseJson.course.state;
          setLocation(`${courseCity}, ${courseState}`);
          const playerObjects = scorecardJson.scorecard[0].players;
          setPlayers(playerObjects);
          setNumberOfHoles(courseJson.course.holes.length);
          const holeObjects = courseJson.course.holes;
          setHoles(holeObjects);
          const scoresData = {};
          scorecardJson.scorecard[0].players.map((player) => {
            const scoresArr = [];
            player.scores.map((scores) => {
              scoresArr.push(scores.score);
            });
            scoresData[player.reference] = scoresArr;
          });
          setPlayerScores(scoresData);
        }
        setIsLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user, id]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col w-screen bg-honeydew pt-16">
      {courseExists ? (
        <>
          <h1>
            {courseName} - {numberOfHoles} holes
          </h1>
          <p>
            {date} at {startTime}, {location}
          </p>
          <div className="grid grid-cols-2">
            <div className="grid grid-cols-3">
              <div className="flex items-center justify-center">Hole</div>
              <div className="flex items-center justify-center">Dist</div>
              <div className="flex items-center justify-center">Par</div>
            </div>
            <div className={`grid grid-cols-${players.length}`}>
              {players.map((player, index) => (
                <div
                  className="flex items-center justify-center overflow-x-hidden"
                  key={index}
                >
                  {player.name}
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2">
            <div>
              {holes.map((hole) => (
                <div className="grid grid-cols-3" key={hole._id}>
                  <div className="flex items-center justify-center text-sm">
                    {hole.holeNumber}
                  </div>
                  <div className="flex items-center justify-center text-sm">
                    {hole.distance}ft
                  </div>
                  <div className="flex items-center justify-center text-sm">
                    {hole.par}
                  </div>
                </div>
              ))}
            </div>
            <div className={`grid grid-cols-${holes.length}`}>
              {holes.map((hole) => (
                <div
                  className={`grid grid-cols-${players.length} justify-items-center`}
                  key={hole.holeNumber}
                >
                  {players.map((player) => (
                    <input
                      type="text"
                      className="w-6 text-center"
                      key={player._id}
                      value={
                        playerScores[player.reference][hole.holeNumber - 1]
                      }
                      onChange={(e) =>
                        handleInputChange(e, player.reference, hole.holeNumber)
                      }
                    ></input>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div>Scorecard does not exist</div>
      )}
      <button onClick={handleScorecardSubmit}>Click</button>
    </div>
  );
}
