import { useContext } from "react"
import { Navigate } from "react-router-dom";
import { VendorAuthContext } from "../context/VendorAuth";
import Loader from "../common/Loader";

export const Vendorrequireauth = ({ children }) => {
    const { user } = useContext(VendorAuthContext);

    if (user === null) {
        return <Loader />;
    }

    if (!user || user.role !== "vendor") {
        return <Navigate to="/login" />;
    }

    return children;
};