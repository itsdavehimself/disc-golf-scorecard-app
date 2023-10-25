import { useEffect, useState } from 'react';
import ScorecardDetails from '../ScorecardDetails/scorecardDetails';
import { useAuthContext } from '../../hooks/useAuthContext';
import { Link } from 'react-router-dom';
import DashboardStats from './dashboardStats';

export default function Dashboard() {
  const [scorecards, setScorecards] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col bg-off-white w-full px-4">
      <div className="pt-16 items-center md:items-start">
        <h2 className="hidden md:flex">Dashboard</h2>
        <DashboardStats scorecards={scorecards} />
        <div className="md:hidden my-4">
          <Link to="/newround">
            <button className="w-full bg-jade py-2 px-3 rounded-md text-off-white font-semibold cursor-pointer hover:bg-emerald transition-colors">
              Start a round
            </button>
          </Link>
        </div>
      </div>
      <div className="flex text-sm text-black-olive items-center font-semibold">
        Last 3 rounds
      </div>
      <div>
        {scorecards &&
          scorecards
            .slice(0, 3)
            .map((scorecard) => (
              <ScorecardDetails key={scorecard._id} scorecard={scorecard} />
            ))}
      </div>
      <div className="flex text-black-olive justify-center items-center font-semibold">
        <Link to={'/scorecards'}>
          <button className="flex py-2 px-3 rounded-md text-sm text-black-olive font-semibold cursor-pointer">
            See all rounds
          </button>
        </Link>
      </div>
    </div>
  );
}
