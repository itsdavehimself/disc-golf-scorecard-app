export function createScoreAndParArrays(scorecards) {
  const rawScoresArr = [];
  const parArray = [];
  const gameObjArr = [];

  scorecards.forEach((scorecard) => {
    scorecard.players.forEach((player) => {
      if (player.type === 'User') {
        let shouldAddGameObj = true;

        player.scores.forEach((score) => {
          if (score && score.score > 0) {
            rawScoresArr.push(score.score);
            parArray.push(score.holePar);
          } else {
            shouldAddGameObj = false;
          }
        });

        if (shouldAddGameObj) {
          const gameObj = {
            scorecard: player.scores,
            scorecardId: scorecard._id,
            course: scorecard.course,
            date: scorecard.date,
          };
          gameObjArr.push(gameObj);
        }
      }
    });
  });

  return { rawScoresArr, parArray, gameObjArr };
}

export function calculateThrows(rawScoresArr) {
  let totalThrows = 0;
  rawScoresArr.forEach((score) => {
    totalThrows += score;
  });

  return totalThrows;
}

export function findMostPlayedCourse(playedCourses, allCourses) {
  const courseCount = {};
  let mostFrequentCourseId;
  let maxCount = 0;

  playedCourses.forEach((course) => {
    if (courseCount[course]) {
      courseCount[course]++;
    } else {
      courseCount[course] = 1;
    }

    if (courseCount[course] > maxCount) {
      mostFrequentCourseId = course;
      maxCount = courseCount[course];
    }
  });

  const mostPlayedCourse = allCourses.find(
    (course) => course._id === mostFrequentCourseId,
  );

  return { mostPlayedCourse, maxCount };
}

export function calculateBestGame(gameObjArr) {
  const sumData = gameObjArr.map((gameObj) => {
    const sumHolePar = gameObj.scorecard.reduce(
      (sum, score) => sum + score.holePar,
      0,
    );
    const sumScores = gameObj.scorecard.reduce(
      (sum, score) => sum + score.score,
      0,
    );
    const difference = sumScores - sumHolePar;
    return {
      scorecardId: gameObj.scorecardId,
      course: gameObj.course,
      date: gameObj.date,
      difference,
    };
  });

  const bestGame = sumData.reduce((minObj, obj) => {
    if (obj.difference < minObj.difference) {
      return obj;
    }
    return minObj;
  }, sumData[0]);

  return bestGame;
}

export function calculateParPerformance(rawScoresArr, parArray) {
  let acesCount = 0;
  let eaglesCount = 0;
  let birdiesCount = 0;
  let parsCount = 0;
  let bogeysCount = 0;
  let dblBogeyCount = 0;
  let trpBogeyCount = 0;

  for (let i = 0; i < Math.min(rawScoresArr.length, parArray.length); i++) {
    const score = rawScoresArr[i];
    const par = parArray[i];

    if (score === 1) {
      acesCount++;
    } else if (score === par - 2) {
      eaglesCount++;
    } else if (score === par - 1) {
      birdiesCount++;
    } else if (score === par) {
      parsCount++;
    } else if (score === par + 1) {
      bogeysCount++;
    } else if (score === par + 2) {
      dblBogeyCount++;
    } else if (score === par + 3) {
      trpBogeyCount++;
    }
  }

  return {
    acesCount,
    eaglesCount,
    birdiesCount,
    parsCount,
    bogeysCount,
    dblBogeyCount,
    trpBogeyCount,
  };
}
