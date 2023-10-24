export function calculateAllFriendStatistics(data) {
  const {
    scorecardsWithUser,
    id,
    gameObjArr,
    rawScoresArr,
    parArray,
    totalScorecards,
  } = data;

  function calculateWinLossTieStats(scorecardsWithUser, id) {
    const userScoresArr = [];
    const friendScoresArr = [];
    let userPoints = 0;
    let friendPoints = 0;
    let ties = 0;

    scorecardsWithUser.forEach((scorecard) => {
      scorecard.players.forEach((player) => {
        if (player.type === 'User') {
          const totalScore = player.scores.reduce(
            (sum, score) => sum + score.score,
            0,
          );
          userScoresArr.push(totalScore);
        } else if (player.reference === id) {
          const totalScore = player.scores.reduce(
            (sum, score) => sum + score.score,
            0,
          );
          friendScoresArr.push(totalScore);
        }
      });
    });

    for (
      let i = 0;
      i < Math.min(userScoresArr.length, friendScoresArr.length);
      i++
    ) {
      const userScore = userScoresArr[i];
      const friendScore = friendScoresArr[i];

      if (userScore > friendScore) {
        friendPoints++;
      } else if (userScore < friendScore) {
        userPoints++;
      } else if (userScore === friendScore) {
        ties++;
      }
    }

    return { userPoints, friendPoints, ties };
  }

  function calculateBestGame(gameObjArr) {
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

  function calculateParPerformance(rawScoresArr, parArray) {
    let acesCount = 0;
    let eaglesCount = 0;
    let birdiesCount = 0;
    let parsCount = 0;
    let bogeyCount = 0;
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
        bogeyCount++;
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
      bogeyCount,
      dblBogeyCount,
      trpBogeyCount,
    };
  }

  function calculateThrows(rawScoresArr) {
    let totalThrows = 0;
    rawScoresArr.forEach((score) => {
      totalThrows += score;
    });

    return totalThrows;
  }

  function getScoreArrays(totalScorecards) {
    const rawScoresArr = [];
    const parArray = [];
    const gameObjArr = [];

    totalScorecards.forEach((scorecard) => {
      scorecard.players.forEach((player) => {
        if (player.reference === id) {
          const gameObj = {
            scorecard: player.scores,
            scorecardId: scorecard._id,
            course: scorecard.course,
            date: scorecard.date,
          };
          gameObjArr.push(gameObj);

          player.scores.forEach((score) => {
            rawScoresArr.push(score.score);
            parArray.push(score.holePar);
          });
        }
      });
    });

    return { rawScoresArr, parArray, gameObjArr };
  }

  const winLossTieStats = calculateWinLossTieStats(scorecardsWithUser, id);
  const scoreArrays = getScoreArrays(totalScorecards);
  const bestGame = calculateBestGame(gameObjArr);
  const parPerformance = calculateParPerformance(rawScoresArr, parArray);
  const totalThrows = calculateThrows(rawScoresArr);

  return {
    userPoints: winLossTieStats.userPoints,
    friendPoints: winLossTieStats.friendPoints,
    ties: winLossTieStats.ties,
    rawScoresArr: scoreArrays.rawScoresArr,
    parArray: scoreArrays.parArray,
    gameObjArr: scoreArrays.gameObjArr,
    bestGame: bestGame,
    acesCount: parPerformance.acesCount,
    eaglesCount: parPerformance.eaglesCount,
    birdiesCount: parPerformance.birdiesCount,
    parsCount: parPerformance.parsCount,
    bogeyCount: parPerformance.bogeyCount,
    dblBogeyCount: parPerformance.dblBogeyCount,
    trpBogeyCount: parPerformance.trpBogeyCount,
    totalThrows: totalThrows,
  };
}
