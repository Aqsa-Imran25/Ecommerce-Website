import React from "react";

export const updateLocalStorageUser = (user) => {
    try {
        localStorage.removeItem("adminInfo");
        localStorage.removeItem("vendorInfo");
        localStorage.removeItem("userInfo");

        if (user.role === "admin") {
            localStorage.setItem("adminInfo", JSON.stringify(user));
        }
        if (user.role === "vendor") {
            localStorage.setItem("vendorInfo", JSON.stringify(user));
        }
        if (user.role === "user") {
            localStorage.setItem("userInfo", JSON.stringify(user));
        }
    } catch (err) {
        console.error("LocalStorage update failed", err);
    }
};


