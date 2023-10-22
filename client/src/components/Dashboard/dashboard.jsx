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
    const fetchScorecards = async () => {
      const response = await fetch('http://localhost:8080/api/scorecards', {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      const json = await response.json();

      if (response.ok) {
        setScorecards(json);
        setIsLoading(false);
      }
    };

    if (user) {
      fetchScorecards();
    }
  }, [user]);

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
