import { createContext, useReducer } from 'react';

export const FriendListContext = createContext();

export const friendListReducer = (state, action) => {
  switch (action.type) {
    case 'SET_FRIENDS':
      return {
        friends: action.payload,
      };
    case 'CREATE_FRIEND':
      return {
        friends: [...state.friends, action.payload],
      };
    default:
      return state;
  }
};

export const FriendListContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(friendListReducer, {
    friends: null,
  });

  return (
    <FriendListContext.Provider value={{ ...state, dispatch }}>
      {children}
    </FriendListContext.Provider>
  );
};
