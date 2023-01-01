import { createContext } from 'react';

export const AuthContext = createContext({
  isLoggedIn: false, 
  userId: null, // this is the user id from the backend
  token: null,
  login: () => {},
  logout: () => {}
});
