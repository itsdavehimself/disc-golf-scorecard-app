import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

export default function ScorecardDetails({ scorecard, searchValueInput = '' }) {
  const navigate = useNavigate();

  const openScorecard = () => {
    navigate(`/scorecard/${scorecard._id}`);
  };

  const playerScores = scorecard.players.map((player) => {
    const arr = player.scores.map((score) => score.score);
    const scoreSum = arr.reduce((acc, current) => acc + current);
    return scoreSum;
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
                {playerScores[index] === scorecard.par ||
                playerScores[index] === 0 ? (
                  'E'
                ) : (
                  <>
                    {playerScores[index] > scorecard.par ? '+' : ''}
                    {playerScores[index] - scorecard.par}
                  </>
                )}{' '}
                ({playerScores[index]})
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
