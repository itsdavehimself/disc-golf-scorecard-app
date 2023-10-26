import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { useAuthContext } from '../../hooks/useAuthContext';
import ScoresBarChart from '../ScoresBarChart/scoresBarChart';
import PlayedCourses from '../PlayedCourses/playedCourses';
import ConfirmDeleteModal from '../ConfirmDeleteModal/confirmDeleteModal';
import { deleteFriend } from '../../utilities/deleteFriendUtility';

import {
  calculateWinLossTieStats,
  calculateParPerformance,
  calculateBestGame,
  calculateThrows,
} from '../../utilities/dataUtilities';
import YearFilterModal from '../YearFilterModal/yearFilterModal';

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

export default function FriendProfile() {
  const { id } = useParams();
  const { user } = useAuthContext();
  const [friend, setFriend] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [totalScorecards, setTotalScorecards] = useState(null);
  const [allScorecards, setAllScorecards] = useState([]);
  const [scorecardsWithUser, setScorecardsWithUser] = useState(null);
  const [holes, setHoles] = useState(0);
  const [userWins, setUserWins] = useState(0);
  const [friendWins, setFriendWins] = useState(0);
  const [ties, setTies] = useState(0);
  const [aces, setAces] = useState(0);
  const [eagles, setEagles] = useState(0);
  const [birdies, setBirdies] = useState(0);
  const [pars, setPars] = useState(0);
  const [bogey, setBogey] = useState(0);
  const [doubleBogeys, setDoubleBogeys] = useState(0);
  const [tripleBogeys, setTripleBogeys] = useState(0);
  const [throws, setThrows] = useState(0);
  const [bestRound, setBestRound] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [playedCourses, setPlayedCourses] = useState([]);
  const [bestRoundCourseName, setBestRoundCourseName] = useState({});
  const [isYearMenuOpen, setIsYearMenuOpen] = useState(false);
  const [filterYear, setFilterYear] = useState('Year');
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const nameForModal = 'player';
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const friendDataResponse = await fetch(
          `http://localhost:8080/api/friends/${id}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          },
        );
        const scorecardsResponse = await fetch(
          `http://localhost:8080/api/scorecards/user/${id}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          },
        );
        const courseResponse = await fetch(
          `http://localhost:8080/api/courses/`,
        );
        const [friend, scorecards, coursesJSON] = await Promise.all([
          friendDataResponse,
          scorecardsResponse,
          courseResponse,
        ]).then((responses) => Promise.all(responses.map((res) => res.json())));

        setFriend(friend.friend);
        const totalScorecards = scorecards.scorecards;
        setTotalScorecards(scorecards.scorecards);
        setAllScorecards(scorecards.scorecards);
        const scorecardsWithUser = scorecards.scorecards.filter((scorecard) => {
          return scorecard.players.some((player) => player.type === 'User');
        });

        setScorecardsWithUser(scorecardsWithUser);
        setAllCourses(coursesJSON);

        const rawScoresArr = [];
        const parArray = [];
        const gameObjArr = [];

        totalScorecards.forEach((scorecard) => {
          scorecard.players.forEach((player) => {
            if (player.reference === id) {
              const gameObj = {
                scorecard: player.scores,
                scorecardId: scorecard._id,
                course: scorecard.course,
                date: scorecard.date,
              };
              gameObjArr.push(gameObj);

              player.scores.forEach((score) => {
                rawScoresArr.push(score.score);
                parArray.push(score.holePar);
              });
            }
          });
        });

        const { userPoints, friendPoints, ties } = calculateWinLossTieStats(
          scorecardsWithUser,
          id,
        );
        const bestGame = calculateBestGame(gameObjArr);
        const {
          acesCount,
          eaglesCount,
          birdiesCount,
          parsCount,
          bogeyCount,
          dblBogeyCount,
          trpBogeyCount,
        } = calculateParPerformance(rawScoresArr, parArray);
        const totalThrows = calculateThrows(rawScoresArr);

        const courseList = [];
        totalScorecards.forEach((scorecard) => {
          const course = scorecard.course;
          if (!courseList.includes(course)) {
            courseList.push(course);
          }
        });

        const matchingCourse = coursesJSON.find((course) => {
          return bestGame && course._id === bestGame.course;
        });

        if (matchingCourse) {
          setBestRoundCourseName(matchingCourse);
        }

        const matchingCourses = coursesJSON.filter((course) =>
          courseList.includes(course._id),
        );

        setPlayedCourses(matchingCourses);
        setBestRound(bestGame);
        setHoles(rawScoresArr.length);
        setThrows(totalThrows);
        setUserWins(userPoints);
        setFriendWins(friendPoints);
        setTies(ties);
        setAces(acesCount);
        setBirdies(birdiesCount);
        setEagles(eaglesCount);
        setPars(parsCount);
        setBogey(bogeyCount);
        setDoubleBogeys(dblBogeyCount);
        setTripleBogeys(trpBogeyCount);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [id, user]);

  const showAllResults = () => {
    const scorecardsWithUser = allScorecards.filter((scorecard) => {
      return scorecard.players.some((player) => player.type === 'User');
    });

    setScorecardsWithUser(scorecardsWithUser);

    const rawScoresArr = [];
    const parArray = [];
    const gameObjArr = [];

    allScorecards.forEach((scorecard) => {
      scorecard.players.forEach((player) => {
        if (player.reference === id) {
          const gameObj = {
            scorecard: player.scores,
            scorecardId: scorecard._id,
            course: scorecard.course,
            date: scorecard.date,
          };
          gameObjArr.push(gameObj);

          player.scores.forEach((score) => {
            rawScoresArr.push(score.score);
            parArray.push(score.holePar);
          });
        }
      });
    });

    const { userPoints, friendPoints, ties } = calculateWinLossTieStats(
      scorecardsWithUser,
      id,
    );
    const bestGame = calculateBestGame(gameObjArr);
    const {
      acesCount,
      eaglesCount,
      birdiesCount,
      parsCount,
      bogeyCount,
      dblBogeyCount,
      trpBogeyCount,
    } = calculateParPerformance(rawScoresArr, parArray);
    const totalThrows = calculateThrows(rawScoresArr);

    const courseList = [];
    allScorecards.forEach((scorecard) => {
      const course = scorecard.course;
      if (!courseList.includes(course)) {
        courseList.push(course);
      }
    });

    const matchingCourse = allCourses.find((course) => {
      return bestGame && course._id === bestGame.course;
    });

    if (matchingCourse) {
      setBestRoundCourseName(matchingCourse);
    }

    const matchingCourses = allCourses.filter((course) =>
      courseList.includes(course._id),
    );

    setFilterYear('Year');
    setTotalScorecards(allScorecards);
    setPlayedCourses(matchingCourses);
    setBestRound(bestGame);
    setHoles(rawScoresArr.length);
    setThrows(totalThrows);
    setUserWins(userPoints);
    setFriendWins(friendPoints);
    setTies(ties);
    setAces(acesCount);
    setBirdies(birdiesCount);
    setEagles(eaglesCount);
    setPars(parsCount);
    setBogey(bogeyCount);
    setDoubleBogeys(dblBogeyCount);
    setTripleBogeys(trpBogeyCount);
  };

  const filterLastFiveRounds = () => {
    const filteredScorecards = allScorecards.slice(-5);
    const scorecardsWithUser = filteredScorecards.filter((scorecard) => {
      return scorecard.players.some((player) => player.type === 'User');
    });

    setScorecardsWithUser(scorecardsWithUser);

    const rawScoresArr = [];
    const parArray = [];
    const gameObjArr = [];

    filteredScorecards.forEach((scorecard) => {
      scorecard.players.forEach((player) => {
        if (player.reference === id) {
          const gameObj = {
            scorecard: player.scores,
            scorecardId: scorecard._id,
            course: scorecard.course,
            date: scorecard.date,
          };
          gameObjArr.push(gameObj);

          player.scores.forEach((score) => {
            rawScoresArr.push(score.score);
            parArray.push(score.holePar);
          });
        }
      });
    });

    const { userPoints, friendPoints, ties } = calculateWinLossTieStats(
      scorecardsWithUser,
      id,
    );
    const bestGame = calculateBestGame(gameObjArr);
    const {
      acesCount,
      eaglesCount,
      birdiesCount,
      parsCount,
      bogeyCount,
      dblBogeyCount,
      trpBogeyCount,
    } = calculateParPerformance(rawScoresArr, parArray);
    const totalThrows = calculateThrows(rawScoresArr);

    const courseList = [];
    filteredScorecards.forEach((scorecard) => {
      const course = scorecard.course;
      if (!courseList.includes(course)) {
        courseList.push(course);
      }
    });

    const matchingCourse = allCourses.find((course) => {
      return bestGame && course._id === bestGame.course;
    });

    if (matchingCourse) {
      setBestRoundCourseName(matchingCourse);
    }

    const matchingCourses = allCourses.filter((course) =>
      courseList.includes(course._id),
    );

    setFilterYear('Year');
    setTotalScorecards(filteredScorecards);
    setPlayedCourses(matchingCourses);
    setBestRound(bestGame);
    setHoles(rawScoresArr.length);
    setThrows(totalThrows);
    setUserWins(userPoints);
    setFriendWins(friendPoints);
    setTies(ties);
    setAces(acesCount);
    setBirdies(birdiesCount);
    setEagles(eaglesCount);
    setPars(parsCount);
    setBogey(bogeyCount);
    setDoubleBogeys(dblBogeyCount);
    setTripleBogeys(trpBogeyCount);
  };

  const filterByYear = (year) => {
    const filteredScorecards = [];
    allScorecards.forEach((scorecard) => {
      const scorecardYear = scorecard.date.substring(0, 4);

      if (scorecardYear === year) {
        filteredScorecards.push(scorecard);
      }
    });

    const scorecardsWithUser = filteredScorecards.filter((scorecard) => {
      return scorecard.players.some((player) => player.type === 'User');
    });
    setScorecardsWithUser(scorecardsWithUser);
    const rawScoresArr = [];
    const parArray = [];
    const gameObjArr = [];
    filteredScorecards.forEach((scorecard) => {
      scorecard.players.forEach((player) => {
        if (player.reference === id) {
          const gameObj = {
            scorecard: player.scores,
            scorecardId: scorecard._id,
            course: scorecard.course,
            date: scorecard.date,
          };
          gameObjArr.push(gameObj);
          player.scores.forEach((score) => {
            rawScoresArr.push(score.score);
            parArray.push(score.holePar);
          });
        }
      });
    });
    const { userPoints, friendPoints, ties } = calculateWinLossTieStats(
      scorecardsWithUser,
      id,
    );
    const bestGame = calculateBestGame(gameObjArr);
    const {
      acesCount,
      eaglesCount,
      birdiesCount,
      parsCount,
      bogeyCount,
      dblBogeyCount,
      trpBogeyCount,
    } = calculateParPerformance(rawScoresArr, parArray);
    const totalThrows = calculateThrows(rawScoresArr);

    const courseList = [];
    filteredScorecards.forEach((scorecard) => {
      const course = scorecard.course;
      if (!courseList.includes(course)) {
        courseList.push(course);
      }
    });

    const matchingCourse = allCourses.find((course) => {
      return bestGame && course._id === bestGame.course;
    });

    if (matchingCourse) {
      setBestRoundCourseName(matchingCourse);
    }

    const matchingCourses = allCourses.filter((course) =>
      courseList.includes(course._id),
    );

    setTotalScorecards(filteredScorecards);
    setPlayedCourses(matchingCourses);
    setBestRound(bestGame);
    setHoles(rawScoresArr.length);
    setThrows(totalThrows);
    setUserWins(userPoints);
    setFriendWins(friendPoints);
    setTies(ties);
    setAces(acesCount);
    setBirdies(birdiesCount);
    setEagles(eaglesCount);
    setPars(parsCount);
    setBogey(bogeyCount);
    setDoubleBogeys(dblBogeyCount);
    setTripleBogeys(trpBogeyCount);
  };

  const outsideYearMenu = useClickOutside(() => {
    setIsYearMenuOpen(false);
  });

  const outsideConfirmDelete = useClickOutside(() => {
    setIsConfirmOpen(false);
  });

  const handleConfirmDelete = () => {
    deleteFriend(id, user);
    setIsConfirmOpen(false);
    navigate('/friends');
  };

  if (isLoading) {
    return <div>Loading...</div>;
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
      {isYearMenuOpen && (
        <YearFilterModal
          outsideYearMenu={outsideYearMenu}
          allScorecards={allScorecards}
          setFilterYear={setFilterYear}
          setIsYearMenuOpen={setIsYearMenuOpen}
          filterByYear={filterByYear}
        />
      )}
      <div className="flex flex-col bg-off-white w-full px-4 text-black-olive">
        <div className="pt-16">
          <div className="text-2xl font-semibold">{friend.name}</div>
          <div className="flex flex-row justify-between items-center">
            <button onClick={showAllResults}>All</button>
            <button onClick={filterLastFiveRounds}>Last Five</button>
            <div>
              <div onClick={() => setIsYearMenuOpen(!isYearMenuOpen)}>
                {filterYear}
              </div>
              <div
                className={`text-sm ${isYearMenuOpen ? 'h-auto' : 'hidden'}`}
              ></div>
            </div>
          </div>

          <div className="text-sm">
            <div>
              Has played in {totalScorecards.length}
              {totalScorecards.length === 1 ? ' round' : ' rounds'} total
            </div>
            <div>
              Has played in {scorecardsWithUser.length}{' '}
              {scorecardsWithUser.length === 1 ? ' round' : ' rounds'} with you
            </div>
          </div>
          <div className="flex flex-row justify-between items-center">
            <div className="text-center">
              <div>{totalScorecards.length}</div>
              <div>{totalScorecards.length === 1 ? 'ROUND' : 'ROUNDS'}</div>
            </div>
            <div className="text-center">
              <div>{holes}</div>
              <div>HOLES</div>
            </div>
            <div className="text-center">
              <div>{throws}</div>
              <div>THROWS</div>
            </div>
          </div>
          <div>
            <div>
              {playedCourses.length}{' '}
              {playedCourses.length === 1 ? 'Course' : 'Courses'} Played
            </div>
            <PlayedCourses
              bestRound={bestRound}
              playedCourses={playedCourses}
              bestRoundCourseName={bestRoundCourseName}
            />
          </div>
          <div>
            <div>Best round</div>
            {bestRound ? (
              <>
                <span className="font-semibold">
                  {bestRound.difference === 0
                    ? 'E'
                    : bestRound.difference > 0
                    ? `+${bestRound.difference}`
                    : bestRound.difference}
                </span>
                <span>
                  {' '}
                  at {bestRoundCourseName.name} {bestRoundCourseName.city},{' '}
                  {bestRoundCourseName.state}
                </span>
              </>
            ) : (
              'No Round Data'
            )}
          </div>
          <div className="pt-6">
            <div className="text-center text-sm font-semibold">
              Your stats vs. {friend.name}
            </div>
            <div className="w-10/12 mx-auto py-2 flex items-center space-x-2 border border-black-olive rounded-xl">
              <div className="flex-1 border-r border-black-olive text-center">
                <div className="text-xl font-bold">{userWins}</div>
                <div className="text-sm">{userWins === 1 ? 'WIN' : 'WINS'}</div>
              </div>
              <div className="flex-1 border-r border-black-olive text-center">
                <div className="text-xl font-bold">{friendWins}</div>
                <div className="text-sm">
                  {friendWins === 1 ? 'LOSS' : 'LOSSES'}
                </div>
              </div>
              <div className="flex-1 text-center">
                <div className="text-xl font-bold">{ties}</div>
                <div className="text-sm">{ties === 1 ? 'TIE' : 'TIES'}</div>
              </div>
            </div>
            <div>
              <ScoresBarChart
                aces={aces}
                eagles={eagles}
                birdies={birdies}
                pars={pars}
                bogey={bogey}
                doubleBogeys={doubleBogeys}
                tripleBogeys={tripleBogeys}
                name={friend.name}
              />
            </div>
          </div>
        </div>
        <div className="pt-4">
          <button onClick={() => setIsConfirmOpen(true)}>Delete friend</button>
        </div>
      </div>
    </>
  );
}
