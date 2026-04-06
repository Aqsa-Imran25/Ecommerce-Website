import { createContext, useState } from "react";

export const UserAuthContext = createContext(); // ✅ Named export
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
    setUser(userData); // 🔥 THIS IS KEY
  };

  return (
    <UserAuthContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </UserAuthContext.Provider>
  );
};
