import { useEffect, useState } from 'react';
import ScorecardDetails from '../ScorecardDetails/scorecardDetails';
import { useAuthContext } from '../../hooks/useAuthContext';
import DashboardStats from '../Dashboard/dashboardStats';

export default function AllScorecards() {
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
