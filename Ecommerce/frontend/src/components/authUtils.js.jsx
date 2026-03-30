export const getUserRole = () => {
  try {
    const admin = JSON.parse(localStorage.getItem("adminInfo"));
    if (admin?.role) return admin.role;

    const vendor = JSON.parse(localStorage.getItem("vendorInfo"));
    if (vendor?.role) return vendor.role;

    const user = JSON.parse(localStorage.getItem("userInfo"));
    if (user?.role) return user.role;

    return null;
  } catch (err) {
    return null;
  }
};