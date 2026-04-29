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
    const admin = adminToken();
    const vendor = vendorToken();
    const user = UserToken();

    if (admin) return admin;
    if (vendor) return vendor;
    if (user) return user;

    return null;
};

// store
export const getAdminVendorToken = () => {
    return adminToken() || vendorToken() || UserToken();
};


export const getUserRole = () => {
    if (adminToken()) return "admin";
    if (vendorToken()) return "vendor";
    if (UserToken()) return "user";
    return null;
};

// STRIPE

export const STRIPE_PUBLIC_KEY = "pk_test_51TMhqKPtKokdEXV3xwEoIK0C8JjBTzf9I3dEVb2Z9TqvaiQyNp1v3zQd3rMUDCA5iE8EajuVBHDU7WxP0WIgQ89K00d1Qn5O4L";