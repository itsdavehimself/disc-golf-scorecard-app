import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuthContext } from '../../hooks/useAuthContext';
import ScoresBarChart from '../ScoresBarChart/scoresBarChart';
import PlayedCourses from '../PlayedCourses/playedCourses';
import { calculateAllFriendStatistics } from '../../utilities/dataUtilities';

export default function FriendProfile() {
  const { id } = useParams();
  const { user } = useAuthContext();
  const [friend, setFriend] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [totalScorecards, setTotalScorecards] = useState(null);
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
  const [courses, setCourses] = useState([]);
  const [bestRound, setBestRound] = useState([]);
  const [playedCourses, setPlayedCourses] = useState([]);
  const [bestRoundCourseName, setBestRoundCourseName] = useState({});

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
        const scorecardsWithUser = scorecards.scorecards.filter((scorecard) => {
          return scorecard.players.some((player) => player.type === 'User');
        });

        setScorecardsWithUser(scorecardsWithUser);

        const {
          userPoints,
          friendPoints,
          ties,
          rawScoresArr,
          parArray,
          gameObjArr,
          bestGame,
          acesCount,
          eaglesCount,
          birdiesCount,
          parsCount,
          bogeyCount,
          dblBogeyCount,
          trpBogeyCount,
          totalThrows,
        } = calculateAllFriendStatistics(
          scorecardsWithUser,
          id,
          gameObjArr,
          rawScoresArr,
          parArray,
          totalScorecards,
        );

        // const { rawScoresArr, parArray, gameObjArr } =
        //   getScoreArrays(totalScorecards);
        // const { userPoints, friendPoints, ties } = calculateWinLossTieStats(
        //   scorecardsWithUser,
        //   id,
        // );
        // const bestGame = calculateBestGame(gameObjArr);
        // const {
        //   acesCount,
        //   eaglesCount,
        //   birdiesCount,
        //   parsCount,
        //   bogeyCount,
        //   dblBogeyCount,
        //   trpBogeyCount,
        // } = calculateParPerformance(rawScoresArr, parArray);
        // const totalThrows = calculateThrows(rawScoresArr);

        const courseList = [];
        totalScorecards.forEach((scorecard) => {
          const course = scorecard.course;
          if (!courseList.includes(course)) {
            courseList.push(course);
          }
        });

        const matchingCourse = coursesJSON.find(
          (course) => course._id === bestGame.course,
        );

        if (matchingCourse) {
          setBestRoundCourseName(matchingCourse);
        }

        const matchingCourses = coursesJSON.filter((course) =>
          courses.includes(course._id),
        );

        setPlayedCourses(matchingCourses);
        setBestRound(bestGame);
        setCourses(courseList);
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
        console.log(error);
      }
    };

    fetchData();
  }, [id, user, totalScorecards, bestRound.course, courses]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col bg-off-white w-full px-4 text-black-olive">
      <div className="pt-16">
        <div className="text-2xl font-semibold">{friend.name}</div>
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
            {courses.length} {courses.length === 1 ? 'Course' : 'Courses'}{' '}
            Played
          </div>
          <PlayedCourses
            bestRound={bestRound}
            playedCourses={playedCourses}
            bestRoundCourseName={bestRoundCourseName}
          />
        </div>
        <div>
          <div>Best round</div>
          <span className="font-semibold">
            {bestRound.difference === 0
              ? 'E'
              : bestRound.difference > 0
              ? `+${bestRound.difference}`
              : bestRound.difference}
          </span>{' '}
          at {bestRoundCourseName.name} {bestRoundCourseName.city},{' '}
          {bestRoundCourseName.state}
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
        </div>
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
  );
}
