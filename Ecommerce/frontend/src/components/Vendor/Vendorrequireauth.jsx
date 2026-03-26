import { useContext } from "react"
import { Navigate } from "react-router-dom";
import { VendorAuthContext } from "../context/VendorAuth";

export const Vendorrequireauth = ({ children }) => {
    const { user } = useContext(VendorAuthContext);
    if (!user) {
        return <Navigate to='/login' />
    }
    return children;
}
