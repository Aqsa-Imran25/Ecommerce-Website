import { useContext } from "react"
import { Navigate } from "react-router-dom";
import { VendorAuthContext } from "../context/VendorAuth";
import Loader from "../common/Loader";

export const Vendorrequireauth = ({ children }) => {
    const { user } = useContext(VendorAuthContext);
    if (user === null) {
        <p><Loader /></p>
    }
    if (!user) {
        return <Navigate to='/login' />
    }
    return children;
}
