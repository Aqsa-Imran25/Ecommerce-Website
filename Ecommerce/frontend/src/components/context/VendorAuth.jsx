import { createContext, useState } from "react";

export const VendorAuthContext = createContext();

export const VendorAuthProvider = ({ children }) => {
    const vendorInfo = localStorage.getItem("vendorInfo");
    const [user, setUser] = useState(vendorInfo ? JSON.parse(vendorInfo) : null);

    const login = (user) => {
        localStorage.setItem("vendorInfo", JSON.stringify(user));
        setUser(user);
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
