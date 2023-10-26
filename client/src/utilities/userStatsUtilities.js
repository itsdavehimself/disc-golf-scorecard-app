export function createScoreAndParArrays(scorecardsJSON) {
  const rawScoresArr = [];
  const parArray = [];
  const gameObjArr = [];

  scorecardsJSON.scorecards.forEach((scorecard) => {
    scorecard.players.forEach((player) => {
      if (player.type === 'User') {
        const gameObj = {
          scorecard: player.scores,
          scorecardId: scorecard._id,
          course: scorecard.course,
          date: scorecard.date,
        };

        player.scores.forEach((score) => {
          if (score && score.score > 0) {
            rawScoresArr.push(score.score);
            parArray.push(score.holePar);
            gameObjArr.push(gameObj);
          }
        });
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

  return mostPlayedCourse;
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
