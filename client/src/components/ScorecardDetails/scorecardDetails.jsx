import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

export default function ScorecardDetails({ scorecard }) {
  const [courseName, setCourseName] = useState('');
  const [holes, setHoles] = useState('');
  const [date, setDate] = useState(null);
  const [startTime, setStartTime] = useState(null);

  const navigate = useNavigate();

  const openScorecard = () => {
    navigate(`/scorecard/${scorecard._id}`);
  };

  useEffect(() => {
    async function fetchCourseName() {
      try {
        const response = await fetch(
          `http://localhost:8080/api/courses/${scorecard.course}`,
        );
        if (response.ok) {
          const courseData = await response.json();
          setCourseName(courseData.course.name);
          setHoles(courseData.course.holes.length);
          const scorecardDate = parseISO(scorecard.date);
          const formattedDate = format(scorecardDate, 'MMM d, yyyy');
          const formattedTime = format(scorecardDate, 'p');
          setDate(formattedDate);
          setStartTime(formattedTime);
        }
      } catch (error) {
        throw Error(error);
      }
    }
    fetchCourseName();
  }, [scorecard.course, scorecard.date]);

  return (
    <div
      onClick={openScorecard}
      className="p-2 my-2 bg-white rounded-md shadow-sm text-black-olive text-sm hover:cursor-pointer active:bg-honeydew"
    >
      <h4>
        <span className="font-semibold">{courseName}</span> - {holes} holes
      </h4>
      <p className="text-xs text-gray">
        {date} at {startTime}
      </p>
      <div className="flex items-center justify-start pt-4 gap-4">
        {scorecard.players.map((player) => (
          <div key={player._id} className="flex items-center gap-2">
            <FontAwesomeIcon
              icon={faUser}
              className="text-xs bg-jade text-off-white px-2 py-2 rounded-full"
            />
            <div>
              <div className="text-xs font-semibold">{player.name}</div>
              <div className="text-xs">+10 (50)</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

ScorecardDetails.propTypes = {
  scorecard: PropTypes.object.isRequired,
};
