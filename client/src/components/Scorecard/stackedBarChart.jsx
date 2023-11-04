import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const getCategoryColor = (index) => {
  const colors = [
    'ace-blue',
    'jade',
    'birdie-green',
    'white',
    'bogey-red',
    'dblbogey',
    'trpbogey',
  ];
  return colors[index];
};

const StackedBarChart = ({ performances }) => {
  const [proportions, setProportions] = useState([]);

  useEffect(() => {
    const totalShots = performances.reduce((total, shots) => total + shots, 0);

    if (totalShots === 0) {
      setProportions(Array(performances.length).fill(0));
    } else {
      const calculatedProportions = performances.map((shots) =>
        Math.round((shots / totalShots) * 100),
      );
      setProportions(calculatedProportions);
    }
  }, [performances]);

  return (
    <div className="rounded-md overflow-x-hidden border-off-white border-2 h-6 text-black">
      <div className="flex">
        {proportions.map((proportion, index) =>
          proportion > 0 ? (
            <div
              key={index}
              className={`flex-grow text-sm font-semibold bar-category ${
                index >= 0 && index <= 2 ? 'text-white' : ''
              } bg-${getCategoryColor(index)} text-center`}
              style={{
                width: `${proportion}%`,
                transition: 'width 0.75s ease',
              }}
            >
              {performances[index]}
            </div>
          ) : null,
        )}
      </div>
    </div>
  );
};

StackedBarChart.propTypes = {
  performances: PropTypes.array,
};

export default StackedBarChart;
