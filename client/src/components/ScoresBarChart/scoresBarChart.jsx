import { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import PropTypes from 'prop-types';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels,
);

export default function ScoresBarChart({
  aces,
  eagles,
  birdies,
  pars,
  bogey,
  doubleBogeys,
  tripleBogeys,
}) {
  const [chartData, setChartData] = useState({
    datasets: [],
  });
  const [chartOptions, setChartOptions] = useState({
    indexAxis: 'y',
    elements: {
      bar: {
        borderRadius: 2,
      },
    },
    layout: {
      padding: {
        right: 20,
      },
    },
    responsive: true,
    plugins: {
      datalabels: {
        display: true,
        color: 'black',
        anchor: 'end',
        align: 'end',
      },
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Par performance',
        font: {
          size: 14,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          display: false,
        },
        border: {
          display: false,
        },
      },
      y: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            weight: 700,
          },
          padding: 0,
        },
      },
    },
    maintainAspectRatio: false,
  });

  useEffect(() => {
    setChartData({
      labels: [
        'Aces',
        'Eages',
        'Birdies',
        'Par',
        'Bogey',
        'Dbl Bogey',
        '3+ Bogey',
      ],
      datasets: [
        {
          label: 'Par performance',
          data: [
            aces,
            eagles,
            birdies,
            pars,
            bogey,
            doubleBogeys,
            tripleBogeys,
          ],
          backgroundColor: [
            'blue',
            'teal',
            'green',
            'gray',
            'red',
            'purple',
            'brown',
          ],
          borderColor: 'black',
          borderWidth: 2,
        },
      ],
    });
  }, [aces, eagles, birdies, pars, bogey, doubleBogeys, tripleBogeys]);

  return (
    <div className="w-full md:col-span-2 relative h-80 m-auto bg-off-white">
      <Bar data={chartData} options={chartOptions} />
    </div>
  );
}

ScoresBarChart.propTypes = {
  aces: PropTypes.number,
  eagles: PropTypes.number,
  birdies: PropTypes.number,
  pars: PropTypes.number,
  bogey: PropTypes.number,
  doubleBogeys: PropTypes.number,
  tripleBogeys: PropTypes.number,
};
