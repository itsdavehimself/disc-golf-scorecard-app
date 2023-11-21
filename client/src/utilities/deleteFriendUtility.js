const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const deleteFriend = async (id, user) => {
  const deleteFriendResponse = await fetch(`${API_BASE_URL}/friends/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  });

  const json = await deleteFriendResponse.json();

  if (!deleteFriendResponse.ok) {
    console.error(json.error);
  }

  if (deleteFriendResponse.ok) {
    return;
  }
};
