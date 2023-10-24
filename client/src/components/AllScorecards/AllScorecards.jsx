import { useEffect, useState } from 'react';
import ScorecardDetails from '../ScorecardDetails/scorecardDetails';
import { useAuthContext } from '../../hooks/useAuthContext';
import DashboardStats from '../Dashboard/dashboardStats';

export default function AllScorecards() {
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
    <div className="flex flex-col bg-off-white w-full px-4 pt-16">
      <DashboardStats scorecards={scorecards} />
      <div className="flex text-sm text-black-olive items-center font-semibold pt-5">
        All rounds
      </div>
      <div>
        {scorecards &&
          scorecards.map((scorecard) => (
            <ScorecardDetails key={scorecard._id} scorecard={scorecard} />
          ))}
      </div>
    </div>
  );
}
