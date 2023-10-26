export const deleteFriend = async (id, user) => {
  const deleteFriendResponse = await fetch(
    `http://localhost:8080/api/friends/${id}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    },
  );

  const json = await deleteFriendResponse.json();

  if (!deleteFriendResponse.ok) {
    console.error(json.error);
  }

  if (deleteFriendResponse.ok) {
    return;
  }
};
