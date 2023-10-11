import { useEffect, useState } from 'react';
import ScorecardDetails from '../ScorecardDetails/scorecardDetails';
import { useAuthContext } from '../../hooks/useAuthContext';

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
      console.log(json);

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
    <div className="home">
      <div className="scorecards">
        {scorecards &&
          scorecards.map((scorecard) => (
            <ScorecardDetails key={scorecard._id} scorecard={scorecard} />
          ))}
      </div>
    </div>
  );
}
