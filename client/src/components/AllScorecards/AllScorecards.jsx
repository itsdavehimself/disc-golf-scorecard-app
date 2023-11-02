import { useEffect, useState } from 'react';
import ScorecardDetails from '../ScorecardDetails/scorecardDetails';
import { useAuthContext } from '../../hooks/useAuthContext';
import DashboardStats from '../Dashboard/dashboardStats';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import LoadingScreen from '../Loading/loadingScreen';
import Logo from '../Logo/Logo';

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
          const roundDataArr = [];

          for (let i = 0; i < courseResponses.length; i++) {
            if (courseResponses[i].ok) {
              const courseData = await courseResponses[i].json();
              const roundData = {
                city: courseData.course.city,
                holes: courseData.course.holes,
                name: courseData.course.name,
                par: courseData.course.par,
                state: courseData.course.state,
                _id: scorecardJSON[i]._id,
                course: scorecardJSON[i].course,
                players: scorecardJSON[i].players,
                date: scorecardJSON[i].date,
                startTime: scorecardJSON[i].startTime,
                userId: scorecardJSON[i].userId,
              };
              roundDataArr.push(roundData);
            }
          }
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
    <div className="flex flex-col bg-off-white w-full px-3 pt-16">
      <DashboardStats scorecards={scorecards} />
      <div className="bg-white rounded-lg mb-2 shadow-lg">
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
