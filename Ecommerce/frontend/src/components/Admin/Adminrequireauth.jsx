import { useContext } from "react"
import { Navigate } from "react-router-dom";
import { AdminAuthContext } from "../context/AdminAuth";
import Loader from "../common/Loader";

export const Adminrequireauth=({children})=>{
    const {user}=useContext(AdminAuthContext);
    if(user === null){
        <p><Loader/></p>
    }
    if(!user){
        return <Navigate to='/login'/>
    }
    return children;
}
