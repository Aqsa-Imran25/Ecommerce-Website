import { createContext, useState, useEffect } from "react";

export const VendorAuthContext = createContext();

export const VendorAuthProvider = ({ children }) => {

  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("vendorInfo");
    return stored ? JSON.parse(stored) : null;
  });

  const login = (userData) => {
    localStorage.setItem("vendorInfo", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("vendorInfo");
    setUser(null);
  };

  return (
    <VendorAuthContext.Provider value={{ user, login, logout }}>
      {children}
    </VendorAuthContext.Provider>
  );
};