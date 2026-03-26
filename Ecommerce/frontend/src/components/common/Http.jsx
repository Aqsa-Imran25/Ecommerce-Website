export const apiUrl=
"http://backend.test/api"

export const adminToken=()=>{
    const data=JSON.parse(localStorage.getItem("adminInfo"));
    return data.token;
}

export const UserToken=()=>{
    const data=JSON.parse(localStorage.getItem("userInfo"));
    return data?.token || null;
}

export const VendorToken=()=>{
    const data=JSON.parse(localStorage.getItem("vendorInfo"));
    return data?.token || null;
}
