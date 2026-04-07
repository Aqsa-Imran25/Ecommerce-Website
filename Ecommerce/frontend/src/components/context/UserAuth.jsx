import { createContext, useState } from "react";
import { updateLocalStorage } from "./updateLocalStorage";

export const UserAuthContext = createContext(); 
export const UserAuthProvider = ({ children }) => {
  const userInfo =
    localStorage.getItem("adminInfo") ||
    localStorage.getItem("vendorInfo") ||
    localStorage.getItem("userInfo");

  const [user, setUser] = useState(userInfo ? JSON.parse(userInfo) : null);

  const login = (userData) => {
    updateLocalStorage(userData);
    setUser(userData);
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  const updateUser = (userData) => {
    updateLocalStorage(userData);
    setUser(userData); 
  };

  return (
    <UserAuthContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </UserAuthContext.Provider>
  );
};
