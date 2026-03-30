import { createContext, useState, useEffect } from "react";

export const VendorAuthContext = createContext();

export const VendorAuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("vendorInfo");
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

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