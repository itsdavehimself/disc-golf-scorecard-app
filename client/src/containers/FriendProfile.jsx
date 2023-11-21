import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { useAuthContext } from '../hooks/useAuthContext';
import ScoresBarChart from '../components/scoresBarChart';
import PlayedCourses from '../components/playedCourses';
import ConfirmDeleteModal from '../components/confirmDeleteModal';
import { deleteFriend } from '../utilities/deleteFriendUtility';

import {
  calculateWinLossTieStats,
  calculateParPerformance,
  calculateBestGame,
  calculateThrows,
} from '../utilities/friendProfileDataUtilities';
import YearFilterModal from '../components/yearFilterModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faAngleRight,
  faEllipsisVertical,
} from '@fortawesome/free-solid-svg-icons';
import FriendMenu from '../components/FriendProfile/friendMenu';
import EditNameModal from '../components/FriendProfile/editNameModal';
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

export default function FriendProfile() {
  const { id } = useParams();
  const { user } = useAuthContext();
  const [friend, setFriend] = useState(null);
  const [friendName, setFriendName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [totalScorecards, setTotalScorecards] = useState(null);
  const [allScorecards, setAllScorecards] = useState([]);
  const [scorecardsWithUser, setScorecardsWithUser] = useState(null);
  const [holes, setHoles] = useState(0);
  const [userWins, setUserWins] = useState(0);
  const [friendWins, setFriendWins] = useState(0);
  const [ties, setTies] = useState(0);
  const [parPerformance, setParPerformance] = useState({
    aces: 0,
    birdies: 0,
    eagles: 0,
    pars: 0,
    bogeys: 0,
    doubleBogeys: 0,
    tripleBogeys: 0,
  });
  const [throws, setThrows] = useState(0);
  const [bestRound, setBestRound] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [playedCourses, setPlayedCourses] = useState([]);
  const [bestRoundCourseName, setBestRoundCourseName] = useState({});
  const [isYearMenuOpen, setIsYearMenuOpen] = useState(false);
  const [filterYear, setFilterYear] = useState('Year');
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [filterType, setFilterType] = useState('All');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditNameOpen, setIsEditNameOpen] = useState(false);

  const handleOpenMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const nameForModal = 'player';
  const navigate = useNavigate();

  const openScorecard = (scorecardId) => {
    navigate(`/scorecards/${scorecardId}`);
  };

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
        setFriendName(friend.friend.name);
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
                players: scorecard.players,
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

        setParPerformance({
          aces: acesCount,
          eagles: eaglesCount,
          birdies: birdiesCount,
          pars: parsCount,
          bogeys: bogeyCount,
          doubleBogeys: dblBogeyCount,
          tripleBogeys: trpBogeyCount,
        });

        setPlayedCourses(matchingCourses);
        setBestRound(bestGame);
        setHoles(rawScoresArr.length);
        setThrows(totalThrows);
        setUserWins(userPoints);
        setFriendWins(friendPoints);
        setTies(ties);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [id, user, friendName]);

  const showFilteredResults = (filter, year) => {
    let filteredScorecards = null;

    if (filter === 'All') {
      filteredScorecards = allScorecards;
    } else if (filter === 'LastTen') {
      filteredScorecards = allScorecards.slice(-10);
    } else if (filter === 'Year') {
      filteredScorecards = [];
      allScorecards.forEach((scorecard) => {
        const scorecardYear = scorecard.date.substring(0, 4);

        if (scorecardYear === year) {
          filteredScorecards.push(scorecard);
        }
      });
      setFilterYear(year);
    }
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
            players: scorecard.players,
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

    setParPerformance({
      aces: acesCount,
      eagles: eaglesCount,
      birdies: birdiesCount,
      pars: parsCount,
      bogeys: bogeyCount,
      doubleBogeys: dblBogeyCount,
      tripleBogeys: trpBogeyCount,
    });

    setFilterType(filter);
    setTotalScorecards(filteredScorecards);
    setPlayedCourses(matchingCourses);
    setBestRound(bestGame);
    setHoles(rawScoresArr.length);
    setThrows(totalThrows);
    setUserWins(userPoints);
    setFriendWins(friendPoints);
    setTies(ties);
  };

  const outsideYearMenu = useClickOutside(() => {
    setIsYearMenuOpen(false);
  });

  const outsideConfirmDelete = useClickOutside(() => {
    setIsConfirmOpen(false);
  });

  const outsideEditNameModal = useClickOutside(() => {
    setIsEditNameOpen(false);
  });

  const handleConfirmDelete = () => {
    deleteFriend(id, user);
    setIsConfirmOpen(false);
    navigate('/friends');
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <>
      {isEditNameOpen && (
        <EditNameModal
          setIsEditNameOpen={setIsEditNameOpen}
          friend={friend}
          setFriendName={setFriendName}
          friendName={friendName}
          outsideEditNameModal={outsideEditNameModal}
        />
      )}
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
          showFilteredResults={showFilteredResults}
        />
      )}
      <section className="flex flex-col bg-off-white w-full px-3 text-black pt-16 items-center">
        <section className="grid grid-cols-10 bg-white rounded-lg shadow-lg px-3 my-3 py-2 w-full lg:w-1/2 xl:w-1/3">
          <header className="col-start-1 col-end-10">
            <div className="text-2xl font-semibold">{friendName}</div>
            <div className="text-sm">
              <div className="pt-1.5">
                Has played in{' '}
                <span className="font-semibold">
                  {totalScorecards.length}
                  {totalScorecards.length === 1 ? ' round' : ' rounds'} total
                </span>
              </div>
              <div>
                Has played in{' '}
                <span className="font-semibold">
                  {scorecardsWithUser.length}
                  {scorecardsWithUser.length === 1 ? ' round' : ' rounds'} with
                  you
                </span>
              </div>
            </div>
          </header>
          <div className="flex justify-end text-lg">
            <button onClick={handleOpenMenu} className="pl-2 h-6 w-6">
              <FontAwesomeIcon
                icon={faEllipsisVertical}
                className="text-gray"
              />
            </button>
            {isMenuOpen && (
              <FriendMenu
                setIsConfirmOpen={setIsConfirmOpen}
                setIsMenuOpen={setIsMenuOpen}
                setIsEditNameOpen={setIsEditNameOpen}
              />
            )}
          </div>
        </section>

        <section className="grid grid-cols-3 justify-items-center gap-14 py-1 px-3 bg-white rounded-lg shadow-lg w-full lg:w-1/2 xl:w-1/3">
          <button
            className={`${
              filterType === 'All'
                ? 'bg-jade text-white font-semibold'
                : 'bg-white text-black'
            }  rounded-md w-full py-0.5`}
            onClick={() => showFilteredResults('All')}
          >
            All
          </button>
          <button
            className={`${
              filterType === 'LastTen'
                ? 'bg-jade text-white font-semibold'
                : 'bg-white text-black'
            }  rounded-md w-full py-0.5`}
            onClick={() => showFilteredResults('LastTen')}
          >
            Last 10
          </button>
          <button
            className={`${
              filterType === 'Year'
                ? 'bg-jade text-white font-semibold'
                : 'bg-white text-black'
            }  rounded-md w-full py-0.5`}
            onClick={() => setIsYearMenuOpen(!isYearMenuOpen)}
          >
            {filterYear}
          </button>
        </section>
        <div
          className={`text-sm ${isYearMenuOpen ? 'h-auto' : 'hidden'}`}
        ></div>
        <section className="flex justify-between text-black py-2 my-3 px-5 bg-white rounded-lg shadow-lg w-full lg:w-1/2 xl:w-1/3">
          <div className="text-center">
            <div className="font-semibold">{totalScorecards.length}</div>
            <div className="text-sm">
              {totalScorecards.length === 1 ? 'ROUND' : 'ROUNDS'}
            </div>
          </div>
          <div className="text-center">
            <div className="font-semibold">{holes}</div>
            <div className="text-sm">HOLES</div>
          </div>
          <div className="text-center">
            <div className="font-semibold">{throws}</div>
            <div className="text-sm">THROWS</div>
          </div>
        </section>
        <section className="bg-white rounded-lg shadow-lg mb-3 pb-2 w-full lg:w-1/2 xl:w-1/3">
          <div className="font-semibold px-3 py-2">
            {playedCourses.length}{' '}
            {playedCourses.length === 1 ? 'Course' : 'Courses'} Played
          </div>
          <PlayedCourses playedCourses={playedCourses} />
        </section>
        <section
          onClick={() => openScorecard(bestRound.scorecardId)}
          className="grid grid-cols-10 bg-white rounded-lg shadow-lg px-3 py-2 mb-3 group hover:cursor-pointer hover:shadow-2xl transition-shadow w-full lg:w-1/2 xl:w-1/3"
        >
          <div className="col-start-1 col-end-10">
            <header className="font-semibold pb-2">Best Round</header>
            {bestRound ? (
              <div className="text-sm">
                <span className="font-semibold">
                  {bestRound.difference === 0
                    ? 'E'
                    : bestRound.difference > 0
                    ? `+${bestRound.difference}`
                    : bestRound.difference}
                </span>{' '}
                at{' '}
                <span className="font-semibold">
                  {bestRoundCourseName.name}{' '}
                </span>
                <span className="text-xs">
                  {bestRoundCourseName.city}, {bestRoundCourseName.state}
                </span>
                <div>
                  <div className="flex flex-row gap-4 pt-1">
                    {bestRound.players.map((player) => (
                      <div key={player.reference}>
                        <div className="flex items-center gap-2">
                          <FontAwesomeIcon
                            icon={faUser}
                            className="text-sm bg-off-white text-gray px-1.5 py-1.5 rounded-full"
                          />
                          {player.name}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              'No Round Data'
            )}
          </div>
          <div className="flex items-center justify-end pr-2">
            <FontAwesomeIcon
              icon={faAngleRight}
              className="text-md text-gray group-hover:text-jade transition"
            />
          </div>
        </section>
        <section className="bg-white rounded-lg shadow-lg py-2 mb-3 w-full lg:w-1/2 xl:w-1/3">
          <header className="text-center text-sm font-semibold pb-2">
            Your stats vs. {friendName}
          </header>
          <div className="grid grid-cols-3 text-center">
            <div className="">
              <div className="text-xl font-bold">{userWins}</div>
              <div className="text-sm">{userWins === 1 ? 'WIN' : 'WINS'}</div>
            </div>
            <div className="">
              <div className="text-xl font-bold">{friendWins}</div>
              <div className="text-sm">
                {friendWins === 1 ? 'LOSS' : 'LOSSES'}
              </div>
            </div>
            <div className="">
              <div className="text-xl font-bold">{ties}</div>
              <div className="text-sm">{ties === 1 ? 'TIE' : 'TIES'}</div>
            </div>
          </div>
        </section>
        <section className="w-full lg:w-1/2 xl:w-1/3">
          <ScoresBarChart
            aces={parPerformance.aces}
            eagles={parPerformance.eagles}
            birdies={parPerformance.birdies}
            pars={parPerformance.pars}
            bogey={parPerformance.bogeys}
            doubleBogeys={parPerformance.doubleBogeys}
            tripleBogeys={parPerformance.tripleBogeys}
            name={friendName}
          />
        </section>
      </section>
    </>
  );
}
