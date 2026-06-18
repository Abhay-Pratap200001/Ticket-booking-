import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

// keeps the logged in user and token available to every component in the app
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // saves the token and user info to localStorage and state after login or register
  const loginUser = (token, userData) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  // clears the saved token and user info, used for logout
  const logoutUser = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// custom hook so components can read auth state without importing useContext everywhere
export const useAuth = () => useContext(AuthContext);
