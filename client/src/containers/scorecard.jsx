import { useParams, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';
import { useEffect, useState, useRef } from 'react';
import { format, parseISO } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faLocationDot,
  faThumbTack,
  faClock,
  faTrashCan,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import ConfirmDeleteModal from '../components/confirmDeleteModal';
import { deleteScorecard } from '../utilities/deleteScorecardUtility';
import { calculateParPerformance } from '../utilities/userStatsUtilities';
import StackedBarChart from '../components/stackedBarChart';
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

export default function Scorecard() {
  const { id } = useParams();
  const { user } = useAuthContext();
  const [isLoading, setIsLoading] = useState(true);
  const [courseExists, setCourseExists] = useState(false);
  const [courseName, setCourseName] = useState('');
  const [date, setDate] = useState(null);
  const [holes, setHoles] = useState([]);
  const [numberOfHoles, setNumberOfHoles] = useState(null);
  const [par, setPar] = useState(null);
  const [holeParArray, setHoleParArray] = useState([]);
  const [startTime, setStartTime] = useState('');
  const [location, setLocation] = useState('');
  const [players, setPlayers] = useState([]);
  const [filteredPlayerScores, setFilteredPlayerScores] = useState([]);
  const [playerScores, setPlayerScores] = useState({});
  const [scorecardId, setScorecardId] = useState(null);
  const [error, setError] = useState(null);
  const [performances, setPerformances] = useState([]);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [savingButtonText, setSavingButtonText] = useState('Save scores');

  const graphColumnWidths = performances.map((performance) =>
    Object.values(performance).map((count) => count),
  );

  const navigate = useNavigate();
  const nameForModal = 'scorecard';

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

    const extractedScores = Object.values(updatedPlayerScores);
    const filteredScores = extractedScores.map((scores) => {
      const filteredHoleParArray = holeParArray.filter((par, index) => {
        const diff = scores[index] - par;
        return diff !== -par;
      });

      const filteredScoreArray = scores.filter((score, index) => {
        const diff = score - holeParArray[index];
        return diff !== -holeParArray[index];
      });

      return {
        holeParArray: filteredHoleParArray,
        scoreArray: filteredScoreArray,
      };
    });
    setFilteredPlayerScores(filteredScores);
    const performanceArray = filteredScores.map((scoreObject) => {
      return calculateParPerformance(
        scoreObject.scoreArray,
        scoreObject.holeParArray,
      );
    });
    setPerformances(performanceArray);
    setPlayerScores(updatedPlayerScores);
  };

  const calculatePlayerTotals = () => {
    const totals = {};
    const performances = {};

    filteredPlayerScores.forEach((player, index) => {
      const scores = player.scoreArray;
      const pars = player.holeParArray;
      const totalScore = scores.reduce((total, score) => total + score, 0);
      const currentParTotal = pars.reduce((total, par) => total + par, 0);
      totals[index] = totalScore;
      performances[index] = totalScore - currentParTotal;
    });

    return { totals, performances };
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
        holePar: holeData.par,
        score: player.scores[index],
      })),
    }));

    return {
      players: playersWithScores,
    };
  };

  const handleScorecardSubmit = async (e) => {
    e.preventDefault();
    setSavingButtonText('Saving...');

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
      setSavingButtonText('Saved');
      setTimeout(() => {
        setSavingButtonText('Save scores');
      }, 3000);
    }
  };

  const handleConfirmDelete = () => {
    deleteScorecard(id, user, players);
    setIsConfirmOpen(false);
    navigate('/');
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
          const filteredScores = scorecardJson.scorecard[0].players.map(
            (player) => {
              const holeParArray = player.scores.map((score) => score.holePar);
              setHoleParArray(holeParArray);
              const scoreArray = player.scores.map((score) => score.score);

              const filteredHoleParArray = holeParArray.filter((par, index) => {
                const diff = scoreArray[index] - par;
                return diff !== -par;
              });

              const filteredScoreArray = scoreArray.filter((score, index) => {
                const diff = score - holeParArray[index];
                return diff !== -holeParArray[index];
              });

              return {
                holeParArray: filteredHoleParArray,
                scoreArray: filteredScoreArray,
              };
            },
          );

          const performanceArray = filteredScores.map((scoreObject) => {
            return calculateParPerformance(
              scoreObject.scoreArray,
              scoreObject.holeParArray,
            );
          });
          setPerformances(performanceArray);
          setFilteredPlayerScores(filteredScores);
          setScorecardId(scorecardJson.scorecard[0]._id);
          setCourseExists(true);
          const scorecardDate = parseISO(scorecardJson.scorecard[0].date);
          const formattedDate = format(scorecardDate, 'MMM d, yyyy');
          const formattedTime = format(scorecardDate, 'p');
          setDate(formattedDate);
          setStartTime(formattedTime);
          setCourseName(courseJson.course.name);
          const courseCity = courseJson.course.city;
          setPar(courseJson.course.par);
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

  const outsideConfirmDelete = useClickOutside(() => {
    setIsConfirmOpen(false);
  });

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <>
      {isConfirmOpen && (
        <ConfirmDeleteModal
          setIsConfirmOpen={setIsConfirmOpen}
          outsideConfirmDelete={outsideConfirmDelete}
          handleConfirmDelete={handleConfirmDelete}
          nameForModal={nameForModal}
        />
      )}
      <section className="flex flex-col w-screen bg-off-white pt-16 text-black px-3 items-center">
        {courseExists ? (
          <>
            <header className="bg-white rounded-lg shadow-lg my-3 px-3 py-2 w-full lg:w-1/2 xl:w-1/3">
              <h1 className="text-xl font-semibold">{courseName}</h1>
              <div className="flex gap-2 text-gray text-sm pt-1">
                <p className="flex items-center">
                  <FontAwesomeIcon
                    icon={faThumbTack}
                    className="pr-1 text-xs"
                  />
                  {numberOfHoles} holes
                </p>
                <p className="flex items-center">
                  <FontAwesomeIcon icon={faClock} className="pr-1 text-xs" />
                  {date} at {startTime}
                </p>
              </div>
              <p className="flex items-center text-gray text-sm pt-1">
                <FontAwesomeIcon
                  icon={faLocationDot}
                  className="pr-1 text-xs"
                />
                {location}
              </p>
            </header>
            <main className="bg-white rounded-lg shadow-lg py-3 w-full lg:w-1/2 xl:w-1/3">
              <section className="flex justify-between pb-3 px-3">
                <div className="flex font-semibold text-lg">Scorecard</div>
                <div className="flex gap-2">
                  <button
                    className={`w-28 rounded-md font-semibold cursor-pointer px-2 hover:bg-emerald transition-colors text-white ${
                      savingButtonText === 'Saved' ||
                      savingButtonText === 'Saving...'
                        ? 'bg-washed-jade hover:bg-washed-jade hover:cursor-default'
                        : 'bg-jade'
                    }`}
                    onClick={handleScorecardSubmit}
                    disabled={
                      savingButtonText === 'Saved' ||
                      savingButtonText === 'Saving...'
                    }
                  >
                    {savingButtonText}
                  </button>
                  <button
                    className="hover:text-gray transition-colors"
                    onClick={() => setIsConfirmOpen(true)}
                  >
                    <FontAwesomeIcon icon={faTrashCan} className="text-lg" />
                  </button>
                </div>
              </section>
              <section className="flex flex-col px-4">
                <div className="grid grid-cols-2">
                  <div className="grid grid-cols-3 px-8">
                    <div className="flex items-center justify-center text-xs">
                      Hole
                    </div>
                    <div className="flex items-center justify-center text-xs">
                      Dist
                    </div>
                    <div className="flex items-center justify-center text-xs">
                      Par
                    </div>
                  </div>
                  <div className={`grid grid-cols-${players.length} gap-10`}>
                    {players.map((player, index) => (
                      <div
                        className="flex text-xs justify-center font-semibold"
                        key={index}
                      >
                        {player.name.length > 6
                          ? player.name.substring(0, 6) + '...'
                          : player.name}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2">
                  <div>
                    {holes.map((hole) => (
                      <div className="grid grid-cols-3 h-7 px-8" key={hole._id}>
                        <div className="flex items-center justify-center text-xs font-semibold">
                          {hole.holeNumber}
                        </div>
                        <div className="flex items-center justify-center text-xs">
                          {hole.distance}ft
                        </div>
                        <div className="flex items-center justify-center text-xs">
                          {hole.par}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className={`grid grid-cols-auto`}>
                    {holes.map((hole) => (
                      <div
                        className={`grid grid-cols-${players.length} justify-items-center gap-10`}
                        key={hole.holeNumber}
                      >
                        {players.map((player) => (
                          <input
                            type="text"
                            className={`w-6 text-center h-max border border-white-smoke rounded-md shadow-sm
                            ${
                              playerScores[player.reference][
                                hole.holeNumber - 1
                              ] === 1
                                ? 'bg-ace-blue text-off-white'
                                : playerScores[player.reference][
                                    hole.holeNumber - 1
                                  ] ===
                                  hole.par - 2
                                ? 'bg-jade text-off-white'
                                : playerScores[player.reference][
                                    hole.holeNumber - 1
                                  ] ===
                                  hole.par - 1
                                ? 'bg-birdie-green text-white'
                                : playerScores[player.reference][
                                    hole.holeNumber - 1
                                  ] ===
                                  hole.par + 1
                                ? 'bg-bogey-red'
                                : playerScores[player.reference][
                                    hole.holeNumber - 1
                                  ] ===
                                  hole.par + 2
                                ? 'bg-dblbogey'
                                : playerScores[player.reference][
                                    hole.holeNumber - 1
                                  ] >=
                                  hole.par + 3
                                ? 'bg-trpbogey'
                                : 'bg-white'
                            }
                          `}
                            key={player.reference}
                            value={
                              playerScores[player.reference][
                                hole.holeNumber - 1
                              ]
                            }
                            onChange={(e) =>
                              handleInputChange(
                                e,
                                player.reference,
                                hole.holeNumber,
                              )
                            }
                          ></input>
                        ))}
                      </div>
                    ))}
                  </div>
                  <div className="text-center">Totals</div>
                  <div
                    className={`grid grid-cols-${players.length} justify-items-center gap-10`}
                  >
                    {players.map((player, index) => (
                      <div
                        className="flex flex-row gap-1"
                        key={player.reference}
                      >
                        <span className="flex items-center justify-center font-semibold">
                          {calculatePlayerTotals().performances[index] > 0
                            ? '+' + calculatePlayerTotals().performances[index]
                            : calculatePlayerTotals().performances[index]}
                        </span>{' '}
                        ({calculatePlayerTotals().totals[index]})
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            </main>

            <section className="bg-white rounded-lg shadow-lg my-3 px-3 py-2 w-full lg:w-1/2 xl:w-1/3">
              <div className="flex font-semibold text-lg pb-3">
                Player overview
              </div>
              <div>
                {players.map((player, index) => (
                  <div className="grid grid-rows-2 pb-3" key={player._id}>
                    <div className="flex justify-between items-center">
                      <div className="flex gap-2 items-center">
                        <FontAwesomeIcon
                          icon={faUser}
                          className="text-xs bg-off-white text-gray px-1.5 py-1.5 rounded-full"
                        />
                        <div className="text-sm">{player.name}</div>
                      </div>
                      <div>
                        <span className="font-semibold">
                          {calculatePlayerTotals().performances[index] > 0
                            ? '+' + calculatePlayerTotals().performances[index]
                            : calculatePlayerTotals().performances[index]}
                        </span>{' '}
                        ({calculatePlayerTotals().totals[index]})
                      </div>
                    </div>
                    <div className="pt-1">
                      <StackedBarChart
                        performances={graphColumnWidths[index]}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </>
        ) : (
          <div>Scorecard does not exist</div>
        )}
      </section>
    </>
  );
}
