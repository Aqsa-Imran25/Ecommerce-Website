export const apiUrl = "http://backend.test/api";

export const adminToken = () => {
    try {
        const data = JSON.parse(localStorage.getItem("adminInfo"));
        return data?.token || null;
    } catch (err) {
        return null;
    }
};

export const UserToken = () => {
    try {
        const data = JSON.parse(localStorage.getItem("userInfo"));
        return data?.token || null;
    } catch (err) {
        return null;
    }
};

export const vendorToken = () => {
    try {
        const data = JSON.parse(localStorage.getItem("vendorInfo"));
        return data?.token || null;
    } catch (err) {
        return null;
    }
};

export const getAuthToken = () => {
    return adminToken() || vendorToken() || UserToken() || null;
};

export const getUserRole = () => {
    if (adminToken()) return "admin";
    if (vendorToken()) return "vendor";
    if (UserToken()) return "user";
    return null;
};