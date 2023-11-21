import { useEffect, useState } from 'react';
import ScorecardDetails from '../components/scorecardDetails';
import { useAuthContext } from '../hooks/useAuthContext';
import DashboardStats from '../components/dashboardStats';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import LoadingScreen from '../components/Loading/loadingScreen';
import Logo from '../components/Logo';

const getCourseForScorecard = (scorecard, courses) => {
  return courses.find((course) => course.course._id === scorecard.course) || {};
};

export default function AllScorecards() {
  const [scorecards, setScorecards] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchValueInput, setSearchValueInput] = useState('');

  const { user } = useAuthContext();

  useEffect(() => {
    async function fetchData() {
      try {
        const scorecardResponse = await fetch(
          'http://localhost:8080/api/scorecards',
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          },
        );
        if (scorecardResponse.ok) {
          const scorecardJSON = await scorecardResponse.json();

          const coursePromises = [];

          for (const scorecard of scorecardJSON) {
            const coursePromise = fetch(
              `http://localhost:8080/api/courses/${scorecard.course}`,
            );
            coursePromises.push(coursePromise);
          }

          const courseResponses = await Promise.all(coursePromises);
          const coursesList = await Promise.all(
            courseResponses.map((promise) => promise.json()),
          );

          const roundDataArr = scorecardJSON.map((scorecard) => {
            const courseForScorecard = getCourseForScorecard(
              scorecard,
              coursesList,
            );

            return {
              city: courseForScorecard.course?.city || '',
              holes: courseForScorecard.course?.holes || '',
              name: courseForScorecard.course?.name || '',
              par: courseForScorecard.course?.par || '',
              state: courseForScorecard.course?.state || '',
              _id: scorecard._id,
              course: scorecard.course,
              players: scorecard.players,
              date: scorecard.date,
              startTime: scorecard.startTime,
              userId: scorecard.userId,
            };
          });

          setScorecards(roundDataArr);
          setIsLoading(false);
        }
      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
  });

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="flex flex-col bg-off-white w-full px-3 pt-16 justify-center items-center">
      <DashboardStats scorecards={scorecards} />
      <div className="bg-white rounded-lg mb-2 shadow-lg w-full lg:w-1/2 xl:w-1/3">
        <div className="flex text-lg px-3 pt-3 pb-2 text-black items-center font-semibold">
          All Rounds
        </div>
        <div className="flex items-center justify-center bg-off-white pl-2 mx-3 rounded-lg">
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            className="text-sm text-black"
          />
          <input
            type="text"
            onChange={(e) => {
              setSearchValueInput(e.target.value);
            }}
            value={searchValueInput}
            placeholder="Search by friend or course name"
            className="bg-off-white w-full p-1 outline-none pl-2 rounded-lg"
          ></input>
        </div>
        <div>
          {scorecards &&
            scorecards.map((scorecard) => (
              <ScorecardDetails
                key={scorecard._id}
                scorecard={scorecard}
                searchValueInput={searchValueInput}
              />
            ))}
        </div>
        <div className="flex items-center justify-center pb-4">
          <Logo fill="rgba(0,0,0,0.3)" stroke="rgba(0,0,0,0.3)" />
        </div>
      </div>
    </div>
  );
}
