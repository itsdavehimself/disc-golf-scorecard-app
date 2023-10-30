import PropTypes from 'prop-types';

export default function DashboardStats({ scorecards }) {
  const currentDate = new Date();
  const latestDate = () => {
    if (scorecards.length === 0) {
      return currentDate;
    }
    return new Date(scorecards[0].date);
  };

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const gamesLastThirtyDays = scorecards.filter((scorecard) => {
    const scorecardDate = new Date(scorecard.date);
    return scorecardDate >= thirtyDaysAgo && scorecardDate <= currentDate;
  });

  const timeDifference = currentDate - latestDate();
  const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

  return (
    <div className="flex justify-between text-black py-2 my-3 px-3 bg-white rounded-lg shadow-lg">
      <div className="flex flex-col items-center justify-center">
        <div className="font-semibold">{scorecards.length} Rounds</div>
        <div className="text-xs">TOTAL</div>
      </div>
      <div className="flex flex-col items-center justify-center">
        <div className="font-semibold">{gamesLastThirtyDays.length} Rounds</div>
        <div className="text-xs">LAST 30 DAYS</div>
      </div>
      <div className="flex flex-col items-center justify-center">
        <div className="font-semibold">
          {daysDifference} {daysDifference === 1 ? 'Day' : 'Days'}
        </div>
        <div className="text-xs">LAST PLAYED</div>
      </div>
    </div>
  );
}

DashboardStats.propTypes = {
  scorecards: PropTypes.array,
};
