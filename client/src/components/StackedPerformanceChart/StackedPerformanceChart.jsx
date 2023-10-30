import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

export default function StackedPerformanceChart({
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
        borderRadius: 3,
      },
    },
    plugins: {
      title: {
        display: false,
      },
      legend: {
        display: false,
      },
    },
    responsive: true,
    scales: {
      x: {
        stacked: true,
        grid: {
          display: false,
        },
        border: {
          display: false,
        },
        display: false,
      },
      y: {
        stacked: true,
        grid: {
          display: false,
        },
        display: false,
      },
    },
  });

  useEffect(() => {
    setChartData({
      labels: [''],
      datasets: [
        {
          data: [aces],
        },
        {
          data: [eagles],
        },
        {
          data: [birdies],
        },
        {
          data: [pars],
        },
        {
          data: [bogey],
        },
        {
          data: [doubleBogeys],
        },
        {
          data: [tripleBogeys],
        },
      ],
    });
  }, [aces, eagles, birdies, pars, bogey, doubleBogeys, tripleBogeys]);

  return (
    <div className="w-full md:col-span-2 relative m-auto bg-off-white">
      <Bar data={chartData} options={chartOptions} />
    </div>
  );
}

StackedPerformanceChart.propTypes = {
  aces: PropTypes.number,
  eagles: PropTypes.number,
  birdies: PropTypes.number,
  pars: PropTypes.number,
  bogey: PropTypes.number,
  doubleBogeys: PropTypes.number,
  tripleBogeys: PropTypes.number,
  name: PropTypes.string,
};
