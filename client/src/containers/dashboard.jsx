import { useEffect, useState } from 'react';
import ScorecardDetails from '../components/scorecardDetails';
import { useAuthContext } from '../hooks/useAuthContext';
import { Link } from 'react-router-dom';
import DashboardStats from '../components/dashboardStats';
import LoadingScreen from '../components/Loading/loadingScreen';

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
    return <LoadingScreen />;
  }

  return (
    <section className="flex flex-col bg-off-white w-full px-3 items-center">
      <section className="pt-16 items-center md:items-start w-full">
        <div className="flex md:hidden mt-3 w-full justify-center">
          <Link
            to="/newround"
            className="flex w-full items-center justify-center"
          >
            <button className="bg-jade w-full py-2 px-3 rounded-md text-white font-semibold cursor-pointer hover:bg-emerald transition-colors">
              Start a round
            </button>
          </Link>
        </div>
      </section>
      <DashboardStats scorecards={scorecards} />
      <main className="rounded-lg bg-white shadow-lg w-full lg:w-1/2 xl:w-1/3">
        <header className="flex text-lg px-3 pt-2 text-black items-center font-semibold">
          Last 5 rounds
        </header>
        {scorecards &&
          scorecards
            .slice(0, 5)
            .map((scorecard) => (
              <ScorecardDetails key={scorecard._id} scorecard={scorecard} />
            ))}
        <div className="flex text-black justify-center items-center">
          <Link to={'/scorecards'}>
            <button className="flex pt-2 pb-4 px-3 rounded-md text-sm font-semibold text-black cursor-pointer">
              See all rounds
            </button>
          </Link>
        </div>
      </main>
    </section>
  );
}
