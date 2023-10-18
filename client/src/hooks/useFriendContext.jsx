import { FriendListContext } from '../context/friendContext';
import { useContext } from 'react';

export const useFriendListContext = () => {
  const context = useContext(FriendListContext);

  if (!context) {
    throw Error(
      'useFriendListContext must be used inside a FriendsListContextProvider',
    );
  }

  return context;
};
