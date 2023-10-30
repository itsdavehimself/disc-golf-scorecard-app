import { useEffect, useState, useRef } from 'react';
import { useAuthContext } from '../hooks/useAuthContext';
import { createScoreAndParArrays } from '../utilities/userStatsUtilities';
import { calculateThrows } from '../utilities/userStatsUtilities';
import { findMostPlayedCourse } from '../utilities/userStatsUtilities';
import { calculateBestGame } from '../utilities/userStatsUtilities';
import { calculateParPerformance } from '../utilities/userStatsUtilities';
import YearFilterModal from '../components/YearFilterModal/yearFilterModal';
import ScoresBarChart from '../components/ScoresBarChart/scoresBarChart';
import PlayedCourses from '../components/PlayedCourses/playedCourses';

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
  }, [user]);

  const showAllResults = () => {
    const filteredScorecards = allScorecards;

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

    setFilteredScorecards(filteredScorecards);
    setThrows(calculatedThrows);
    setPlayedCourses(filteredPlayedCourses);
    setMostPlayedCount(maxCount);
    setBestRound(bestGame);
    setMostPlayedCourse(mostPlayedCourse);
    setThrows(calculatedThrows);
    setPlayedHoles(rawScoresArr.length);
  };

  const filterLastFiveRounds = () => {
    const filteredScorecards = allScorecards.slice(-5);

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

    setFilteredScorecards(filteredScorecards);
    setThrows(calculatedThrows);
    setPlayedCourses(filteredPlayedCourses);
    setMostPlayedCount(maxCount);
    setBestRound(bestGame);
    setMostPlayedCourse(mostPlayedCourse);
    setThrows(calculatedThrows);
    setPlayedHoles(rawScoresArr.length);
  };

  const filterByYear = (year) => {
    const filteredScorecards = [];
    allScorecards.forEach((scorecard) => {
      const scorecardYear = scorecard.date.substring(0, 4);

      if (scorecardYear === year) {
        filteredScorecards.push(scorecard);
      }
    });
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
    return <div>Loading...</div>;
  }

  return (
    <>
      {isYearMenuOpen && (
        <YearFilterModal
          outsideYearMenu={outsideYearMenu}
          allScorecards={allScorecards}
          setFilterYear={setFilterYear}
          setIsYearMenuOpen={setIsYearMenuOpen}
          filterByYear={filterByYear}
        />
      )}
      <div className="flex flex-col bg-off-white w-full px-4 text-black pt-16">
        <div>{user.user.username}</div>
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
        <div className="flex flex-row justify-between items-center">
          <div className="text-center">
            <div>{filteredScorecards.length}</div>
            <div>ROUNDS</div>
          </div>
          <div className="text-center">
            <div>{playedHoles}</div>
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
          <PlayedCourses playedCourses={playedCourses} />
          <div>
            <div>Most Played Course</div>
            <div>
              {mostPlayedCourse.name} {mostPlayedCourse.city},{' '}
              {mostPlayedCourse.state} - {mostPlayedCount} Rounds
            </div>
          </div>
          <div>
            <div>Best Round</div>
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
                  at {bestRoundCourse.name} {bestRoundCourse.city},{' '}
                  {bestRoundCourse.state}
                </span>
              </>
            ) : (
              'No Round Data'
            )}
          </div>
        </div>
        <div>
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
