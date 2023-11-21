import { useEffect, useState, useRef } from 'react';
import { useAuthContext } from '../hooks/useAuthContext';
import { createScoreAndParArrays } from '../utilities/userStatsUtilities';
import { calculateThrows } from '../utilities/userStatsUtilities';
import { findMostPlayedCourse } from '../utilities/userStatsUtilities';
import { calculateBestGame } from '../utilities/userStatsUtilities';
import { calculateParPerformance } from '../utilities/userStatsUtilities';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faAngleRight,
  faThumbTack,
} from '@fortawesome/free-solid-svg-icons';
import YearFilterModal from '../components/yearFilterModal';
import ScoresBarChart from '../components/scoresBarChart';
import PlayedCourses from '../components/playedCourses';
import LoadingScreen from '../components/Loading/loadingScreen';

export default function MyStats() {
  const { user } = useAuthContext();
  const [allCourses, setAllCourses] = useState([]);
  const [playedCourses, setPlayedCourses] = useState([]);
  const [allScorecards, setAllScorecards] = useState([]);
  const [filteredScorecards, setFilteredScorecards] = useState([]);
  const [playedHoles, setPlayedHoles] = useState(null);
  const [throws, setThrows] = useState(null);
  const [mostPlayedCourse, setMostPlayedCourse] = useState(null);
  const [mostPlayedCount, setMostPlayedCount] = useState(null);
  const [bestRound, setBestRound] = useState(null);
  const [bestRoundCourse, setBestRoundCourse] = useState(null);
  const [parPerformance, setParPerformance] = useState({
    aces: 0,
    birdies: 0,
    eagles: 0,
    pars: 0,
    bogeys: 0,
    doubleBogeys: 0,
    tripleBogeys: 0,
  });
  const [isYearMenuOpen, setIsYearMenuOpen] = useState(false);
  const [filterYear, setFilterYear] = useState('Year');
  const [isLoading, setIsLoading] = useState(true);
  const [filterType, setFilterType] = useState('All');

  const navigate = useNavigate();

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

  const openScorecard = (scorecardId) => {
    navigate(`/scorecards/${scorecardId}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const scorecardsResponse = await fetch(
          `http://localhost:8080/api/scorecards`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          },
        );
        const coursesResponse = await fetch(
          'http://localhost:8080/api/courses',
        );
        const [scorecardsJSON, coursesJSON] = await Promise.all([
          scorecardsResponse,
          coursesResponse,
        ]).then((responses) => Promise.all(responses.map((res) => res.json())));

        const playedCourseIdList = [];
        scorecardsJSON.forEach((scorecard) => {
          const course = scorecard.course;
          playedCourseIdList.push(course);
        });

        const { mostPlayedCourse, maxCount } = findMostPlayedCourse(
          playedCourseIdList,
          coursesJSON,
        );

        const uniqueCourseIdList = [];
        scorecardsJSON.forEach((scorecard) => {
          const course = scorecard.course;
          if (!uniqueCourseIdList.includes(course)) {
            uniqueCourseIdList.push(course);
          }
        });

        const filteredPlayedCourses = coursesJSON.filter((course) =>
          uniqueCourseIdList.includes(course._id),
        );

        const { rawScoresArr, parArray, gameObjArr } =
          createScoreAndParArrays(scorecardsJSON);

        const calculatedThrows = calculateThrows(rawScoresArr);

        const bestGame = calculateBestGame(gameObjArr);

        const matchingCourse = coursesJSON.find((course) => {
          return bestGame && course._id === bestGame.course;
        });

        if (matchingCourse) {
          setBestRoundCourse(matchingCourse);
        }

        const {
          acesCount,
          eaglesCount,
          birdiesCount,
          parsCount,
          bogeysCount,
          dblBogeyCount,
          trpBogeyCount,
        } = calculateParPerformance(rawScoresArr, parArray);

        setParPerformance({
          aces: acesCount,
          eagles: eaglesCount,
          birdies: birdiesCount,
          pars: parsCount,
          bogeys: bogeysCount,
          doubleBogeys: dblBogeyCount,
          tripleBogeys: trpBogeyCount,
        });

        setFilteredScorecards(scorecardsJSON);
        setMostPlayedCount(maxCount);
        setBestRound(bestGame);
        setMostPlayedCourse(mostPlayedCourse);
        setThrows(calculatedThrows);
        setPlayedHoles(rawScoresArr.length);
        setAllCourses(coursesJSON);
        setAllScorecards(scorecardsJSON);
        setPlayedCourses(filteredPlayedCourses);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

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

    const playedCourseIdList = [];
    filteredScorecards.forEach((scorecard) => {
      const course = scorecard.course;
      playedCourseIdList.push(course);
    });

    const { mostPlayedCourse, maxCount } = findMostPlayedCourse(
      playedCourseIdList,
      allCourses,
    );

    const uniqueCourseIdList = [];
    filteredScorecards.forEach((scorecard) => {
      const course = scorecard.course;
      if (!uniqueCourseIdList.includes(course)) {
        uniqueCourseIdList.push(course);
      }
    });

    const filteredPlayedCourses = allCourses.filter((course) =>
      uniqueCourseIdList.includes(course._id),
    );

    const { rawScoresArr, parArray, gameObjArr } =
      createScoreAndParArrays(filteredScorecards);

    const calculatedThrows = calculateThrows(rawScoresArr);

    const bestGame = calculateBestGame(gameObjArr);

    const matchingCourse = allCourses.find((course) => {
      return bestGame && course._id === bestGame.course;
    });

    if (matchingCourse) {
      setBestRoundCourse(matchingCourse);
    }

    const {
      acesCount,
      eaglesCount,
      birdiesCount,
      parsCount,
      bogeysCount,
      dblBogeyCount,
      trpBogeyCount,
    } = calculateParPerformance(rawScoresArr, parArray);

    setParPerformance({
      aces: acesCount,
      eagles: eaglesCount,
      birdies: birdiesCount,
      pars: parsCount,
      bogeys: bogeysCount,
      doubleBogeys: dblBogeyCount,
      tripleBogeys: trpBogeyCount,
    });

    setFilterType(filter);
    setFilteredScorecards(filteredScorecards);
    setThrows(calculatedThrows);
    setPlayedCourses(filteredPlayedCourses);
    setMostPlayedCount(maxCount);
    setBestRound(bestGame);
    setMostPlayedCourse(mostPlayedCourse);
    setThrows(calculatedThrows);
    setPlayedHoles(rawScoresArr.length);
  };

  const outsideYearMenu = useClickOutside(() => {
    setIsYearMenuOpen(false);
  });

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <>
      {isYearMenuOpen && (
        <YearFilterModal
          outsideYearMenu={outsideYearMenu}
          allScorecards={allScorecards}
          setFilterYear={setFilterYear}
          setIsYearMenuOpen={setIsYearMenuOpen}
          showFilteredResults={showFilteredResults}
        />
      )}
      <div className="flex flex-col bg-off-white w-full px-3 text-black pt-20 items-center">
        <div className="grid grid-cols-3 justify-items-center gap-14 py-1 px-3 bg-white rounded-lg shadow-lg w-full lg:w-1/2 xl:w-1/3">
          <button
            className={`${
              filterType === 'All'
                ? 'bg-jade text-white font-semibold'
                : 'bg-white text-black hover:bg-off-white transition-colors'
            }  rounded-md w-full py-0.5`}
            onClick={() => showFilteredResults('All')}
          >
            All
          </button>
          <button
            className={`${
              filterType === 'LastTen'
                ? 'bg-jade text-white font-semibold'
                : 'bg-white text-black hover:bg-off-white transition-colors'
            }  rounded-md w-full py-0.5`}
            onClick={() => showFilteredResults('LastTen')}
          >
            Last 10
          </button>
          <button
            className={`${
              filterType === 'Year'
                ? 'bg-jade text-white font-semibold'
                : 'bg-white text-black hover:bg-off-white transition-colors'
            }  rounded-md w-full py-0.5`}
            onClick={() => setIsYearMenuOpen(!isYearMenuOpen)}
          >
            {filterYear}
          </button>
        </div>
        <div
          className={`text-sm ${isYearMenuOpen ? 'h-auto' : 'hidden'}`}
        ></div>
        <div className="flex justify-between text-black py-2 my-3 px-5 bg-white rounded-lg shadow-lg w-full lg:w-1/2 xl:w-1/3">
          <div className="text-center">
            <div className="font-semibold">{filteredScorecards.length}</div>
            <div className="text-sm">
              {filteredScorecards.length === 1 ? 'ROUND' : 'ROUNDS'}
            </div>
          </div>
          <div className="text-center">
            <div className="font-semibold">{playedHoles}</div>
            <div className="text-sm">HOLES</div>
          </div>
          <div className="text-center">
            <div className="font-semibold">{throws}</div>
            <div className="text-sm">THROWS</div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-lg mb-3 w-full lg:w-1/2 xl:w-1/3">
          <div className="font-semibold px-3 py-2">
            {playedCourses.length}{' '}
            {playedCourses.length === 1 ? 'Course' : 'Courses'} Played
          </div>
          <PlayedCourses playedCourses={playedCourses} />
          <div className="py-2 px-3">
            <div className="font-semibold">Most Played Course</div>
            <div className="flex flex-row gap-2 items-center">
              <FontAwesomeIcon icon={faThumbTack} />
              <div>
                <p>
                  <span className="font-semibold text-sm">
                    {mostPlayedCourse.name}
                  </span>{' '}
                  <span className="text-xs">
                    {mostPlayedCourse.city}, {mostPlayedCourse.state}
                  </span>
                </p>
                <p className="text-xs">{mostPlayedCount} Rounds</p>
              </div>
            </div>
          </div>
        </div>
        <div
          onClick={() => openScorecard(bestRound.scorecardId)}
          className="grid grid-cols-10 bg-white rounded-lg shadow-lg px-3 py-2 mb-3 group hover:cursor-pointer w-full lg:w-1/2 xl:w-1/3 hover:shadow-2xl transition-shadow"
        >
          <div className="col-start-1 col-end-10">
            <div className="font-semibold pb-2">Best Round</div>
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
                <span className="font-semibold">{bestRoundCourse.name} </span>
                <span className="text-xs">
                  {bestRoundCourse.city}, {bestRoundCourse.state}
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
        </div>

        <div className="w-full lg:w-1/2 xl:w-1/3">
          <ScoresBarChart
            aces={parPerformance.aces}
            eagles={parPerformance.eagles}
            birdies={parPerformance.birdies}
            pars={parPerformance.pars}
            bogey={parPerformance.bogeys}
            doubleBogeys={parPerformance.doubleBogeys}
            tripleBogeys={parPerformance.tripleBogeys}
            name={user.user.username}
          />
        </div>
      </div>
    </>
  );
}
