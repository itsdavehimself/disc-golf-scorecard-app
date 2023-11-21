import PropTypes from 'prop-types';

export default function YearFilterModal({
  outsideYearMenu,
  allScorecards,
  setFilterYear,
  setIsYearMenuOpen,
  showFilteredResults,
}) {
  const years = allScorecards.map((scorecard) =>
    scorecard.date.substring(0, 4),
  );

  const yearOptions = [];
  years.forEach((year) => {
    if (!yearOptions.includes(year)) {
      yearOptions.push(year);
    }
  });

  const yearOptionsDescending = yearOptions.sort((a, b) => b - a);

  function countOccurrences(arr, yearToCount) {
    return arr.reduce((count, year) => {
      return year === yearToCount ? count + 1 : count;
    }, 0);
  }

  const yearCounts = [];

  yearOptionsDescending.forEach((year) => {
    const occurrences = countOccurrences(years, year);
    const yearObject = {
      year: year,
      count: occurrences,
    };
    yearCounts.push(yearObject);
  });

  return (
    <div className="flex items-center justify-center absolute z-50 w-screen h-screen bg-modal">
      <div
        ref={outsideYearMenu}
        className="relative flex flex-col justify-center gap-6 py-5 px-5 w-2/3 lg:w-1/4 xl:w-1/5 xl:max-w-xs h-max mx-4 bg-white rounded-md"
      >
        <p className="text-center">Choose a year to view stats</p>
        <div className="grid grid-rows-auto gap-2">
          {yearCounts.length > 0 ? (
            yearCounts.map((yearObj) => (
              <div
                key={yearObj.year}
                onClick={() => {
                  setFilterYear(yearObj.year);
                  setIsYearMenuOpen(false);
                  showFilteredResults('Year', yearObj.year);
                }}
                className="flex justify-between items-center bg-white h-12 px-4 py-1 rounded-md hover:cursor-pointer hover:bg-off-white transition-colors"
              >
                <div className="font-semibold">{yearObj.year}</div>
                <div className="text-xs">
                  {yearObj.count} {yearObj.count === 1 ? 'Round' : 'Rounds'}{' '}
                  Played
                </div>
              </div>
            ))
          ) : (
            <div className="text-center font-semibold">No Data Available</div>
          )}
        </div>
        <button onClick={() => setIsYearMenuOpen(false)}>Cancel</button>
      </div>
    </div>
  );
}

YearFilterModal.propTypes = {
  allScorecards: PropTypes.array,
  setIsYearMenuOpen: PropTypes.func,
  setFilterYear: PropTypes.func,
  showFilteredResults: PropTypes.func,
  outsideYearMenu: PropTypes.shape({
    current: PropTypes.instanceOf(Element),
  }),
};
