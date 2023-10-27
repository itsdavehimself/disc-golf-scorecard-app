import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

export default function ScorecardDetails({ scorecard, searchValueInput = '' }) {
  const navigate = useNavigate();
  const playerPerformances = [];

  const openScorecard = () => {
    navigate(`/scorecard/${scorecard._id}`);
  };

  const filteredScores = scorecard.players.map((player) => {
    const holeParArray = player.scores.map((score) => score.holePar);
    const scoreArray = player.scores.map((score) => score.score);

    const filteredHoleParArray = holeParArray.filter((par, index) => {
      const diff = scoreArray[index] - par;
      return diff !== -par;
    });

    const filteredScoreArray = scoreArray.filter((score, index) => {
      const diff = score - holeParArray[index];
      return diff !== -holeParArray[index];
    });

    return {
      holeParArray: filteredHoleParArray,
      scoreArray: filteredScoreArray,
    };
  });

  filteredScores.forEach((player) => {
    const scores = player.scoreArray;
    const pars = player.holeParArray;
    const totalScore = scores.reduce((total, score) => total + score, 0);
    const currentParTotal = pars.reduce((total, par) => total + par, 0);
    const playerPerformanceObj = {
      score: totalScore,
      performance: totalScore - currentParTotal,
    };
    playerPerformances.push(playerPerformanceObj);
  });

  const scorecardDate = parseISO(scorecard.date);
  const formattedDate = format(scorecardDate, 'MMM d, yyyy');
  const formattedTime = format(scorecardDate, 'p');

  const matchesPlayer = scorecard.players.some((player) =>
    player.name.toLowerCase().startsWith(searchValueInput.toLowerCase()),
  );

  return (
    <div
      onClick={openScorecard}
      className={`p-2 my-2 bg-white rounded-md shadow-sm text-black-olive text-sm hover:cursor-pointer active:bg-honeydew ${
        scorecard.name
          .toLowerCase()
          .startsWith(searchValueInput.toLowerCase()) || matchesPlayer
          ? 'block'
          : 'hidden'
      }`}
    >
      <h4>
        <span className="font-semibold">{scorecard.name}</span> -{' '}
        {scorecard.holes.length} holes
      </h4>
      <p className="text-xs text-gray">
        {formattedDate} at {formattedTime}
      </p>
      <div className="flex items-center justify-start pt-4 gap-4">
        {scorecard.players.map((player, index) => (
          <div key={player._id} className="flex items-center gap-2">
            <FontAwesomeIcon
              icon={faUser}
              className="text-xs bg-jade text-off-white px-2 py-2 rounded-full"
            />
            <div>
              <div className="text-xs font-semibold">{player.name}</div>
              <div className="text-xs">
                {playerPerformances[index].score === scorecard.par ||
                playerPerformances[index].score === 0 ? (
                  'E'
                ) : (
                  <>
                    {playerPerformances[index].score > scorecard.par ? '+' : ''}
                    {playerPerformances[index].performance}
                  </>
                )}{' '}
                ({playerPerformances[index].score})
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

ScorecardDetails.propTypes = {
  scorecard: PropTypes.object.isRequired,
  searchValueInput: PropTypes.string,
};
