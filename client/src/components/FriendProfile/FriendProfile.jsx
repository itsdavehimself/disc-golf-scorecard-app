import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuthContext } from '../../hooks/useAuthContext';

export default function FriendProfile() {
  const { id } = useParams();
  const { user } = useAuthContext();
  const [friend, setFriend] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [totalScorecards, setTotalScorecards] = useState(null);
  const [scorecardsWithUser, setScorecardsWithUser] = useState(null);
  const [userWins, setUserWins] = useState(0);
  const [friendWins, setFriendWins] = useState(0);
  const [ties, setTies] = useState(0);
  const [aces, setAces] = useState(0);
  const [eagles, setEagles] = useState(0);
  const [birdies, setBirdies] = useState(0);
  const [pars, setPars] = useState(0);
  const [bogey, setBogey] = useState(0);
  const [doubleBogeys, setDoubleBogeys] = useState(0);
  const [tripleBogeys, setTripleBogeys] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const friendDataResponse = await fetch(
          `http://localhost:8080/api/friends/${id}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          },
        );
        const scorecardsResponse = await fetch(
          `http://localhost:8080/api/scorecards/user/${id}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          },
        );

        const [friend, scorecards] = await Promise.all([
          friendDataResponse,
          scorecardsResponse,
        ]).then((responses) => Promise.all(responses.map((res) => res.json())));

        setFriend(friend.friend);
        const totalScorecards = scorecards.scorecards;
        setTotalScorecards(scorecards.scorecards);
        const scorecardsWithUser = scorecards.scorecards.filter((scorecard) => {
          return scorecard.players.some((player) => player.type === 'User');
        });

        setScorecardsWithUser(scorecardsWithUser);
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

        const scoresArray = [];
        const parArray = [];

        totalScorecards.forEach((scorecard) => {
          scorecard.players.forEach((player) => {
            if (player.reference === id) {
              player.scores.forEach((score) => {
                scoresArray.push(score.score);
              });
              player.scores.forEach((score) => {
                parArray.push(score.holePar);
              });
            }
          });
        });

        let acesCount = 0;
        let eaglesCount = 0;
        let birdiesCount = 0;
        let parsCount = 0;
        let bogeyCount = 0;
        let dblBogeyCount = 0;
        let trpBogeyCount = 0;

        for (
          let i = 0;
          i < Math.min(scoresArray.length, parArray.length);
          i++
        ) {
          const score = scoresArray[i];
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
        setUserWins(userPoints);
        setFriendWins(friendPoints);
        setTies(ties);
        setAces(acesCount);
        setBirdies(birdiesCount);
        setEagles(eaglesCount);
        setPars(parsCount);
        setBogey(bogeyCount);
        setDoubleBogeys(dblBogeyCount);
        setTripleBogeys(trpBogeyCount);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [id, user, totalScorecards]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col bg-off-white w-full px-4 text-black-olive">
      <div className="pt-16">
        <div className="text-2xl font-semibold">{friend.name}</div>
        <div className="text-sm">
          <div>
            Has played in {totalScorecards.length}
            {totalScorecards.length === 1 ? ' round' : ' rounds'} total
          </div>
          <div>
            Has played in {scorecardsWithUser.length}{' '}
            {scorecardsWithUser.length === 1 ? ' round' : ' rounds'} with you
          </div>
        </div>
        <div className="pt-6">
          <div className="text-center text-sm font-semibold">
            Your stats vs. {friend.name}
          </div>
          <div className="w-10/12 mx-auto py-2 flex items-center space-x-2 border border-black-olive rounded-xl">
            <div className="flex-1 border-r border-black-olive text-center">
              <div className="text-xl font-bold">{userWins}</div>
              <div className="text-sm">WINS</div>
            </div>
            <div className="flex-1 border-r border-black-olive text-center">
              <div className="text-xl font-bold">{friendWins}</div>
              <div className="text-sm">LOSSES</div>
            </div>
            <div className="flex-1 text-center">
              <div className="text-xl font-bold">{ties}</div>
              <div className="text-sm">TIES</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
