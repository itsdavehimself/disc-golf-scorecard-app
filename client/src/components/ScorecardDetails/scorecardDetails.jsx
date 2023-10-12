import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ScorecardDetails({ scorecard }) {
  const [courseName, setCourseName] = useState('');
  const [holes, setHoles] = useState('');
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
        }
      } catch (error) {
        throw Error(error);
      }
    }
    fetchCourseName();
  }, [scorecard.course]);

  return (
    <div onClick={openScorecard} className="scorecard-details">
      <h4 className="scorecard-course">{courseName}</h4>
      <p>{holes} holes</p>
      <p className="date">{scorecard.date}</p>
      {scorecard.players.map((player) => (
        <div key={player._id}>
          <span>{player.name}</span>
        </div>
      ))}
    </div>
  );
}

ScorecardDetails.propTypes = {
  scorecard: PropTypes.object.isRequired,
};
