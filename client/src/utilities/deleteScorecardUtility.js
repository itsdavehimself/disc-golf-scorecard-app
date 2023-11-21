const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const deleteScorecardReferences = async (
  friendPlayerRefs,
  scorecardId,
  user,
) => {
  try {
    const deleteRequest = friendPlayerRefs.map(async (friendRef) => {
      const delFriendRefResponse = await fetch(
        `${API_BASE_URL}/friends/${friendRef}/scorecard/${scorecardId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        },
      );
      if (!delFriendRefResponse.ok) {
        throw new Error(
          'Failed to delete scorecard reference at friend document',
        );
      }
    });
    await Promise.all(deleteRequest);
  } catch (error) {
    console.error(error);
  }
};

export const deleteScorecard = async (scorecardId, user, players) => {
  const friendPlayersRefs = players
    .filter((player) => player.type === 'Friend')
    .map((friend) => friend.reference);

  const deleteScorecardResponse = await fetch(
    `${API_BASE_URL}/scorecards/${scorecardId}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    },
  );

  const json = await deleteScorecardResponse.json();

  if (!deleteScorecardResponse.ok) {
    console.error(json.error);
  }

  if (deleteScorecardResponse.ok) {
    deleteScorecardReferences(friendPlayersRefs, scorecardId, user);
  }
};
