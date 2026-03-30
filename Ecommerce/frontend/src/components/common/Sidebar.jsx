import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AdminAuthContext } from '../context/AdminAuth';

function Sidebar({ role }) {
    const { logout } = useContext(AdminAuthContext);

    let sideBarLinks = [];

    if (role === "admin") {
        sideBarLinks = [
            { name: "Dashboard", path: "/admin/dashboard" },
            { name: "Categories", path: "/admin/categories" },
            { name: "Brands", path: "/admin/brands" },
            { name: "Sizes", path: "/admin/sizes" },
            { name: "Products", path: "/products" },
            { name: "Shipping", path: "/admin/shipping" },
            { name: "Stores", path: "/admin/stores" },
            { name: "Orders", path: "/admin/orders" },
            { name: "Users", path: "/admin/users" },
        ];
    }
    else if (role === "vendor") {
        sideBarLinks = [
            { name: "Dashboard", path: "/vendor/dashboard" },
            { name: "Products", path: "/vendor/products/create" },
            { name: "My Account", path: "/myaccount" },
            { name: "Orders", path: "/myorder" },
            { name: "Create Product", path: "/products/create" },
        ];
    }

    return (
        <div className='shadow-lg p-4 rounded-lg border-2 border-gray-200'>
            <ul className='px-5'>

                {sideBarLinks.map((links) => (
                    <li
                        key={links.path}
                        className='text-black py-2 border-b-2 border-gray-100 hover:text-[#007595]'
                    >
                        <Link to={links.path}>{links.name}</Link>
                    </li>
                ))}

                <li className="text-black py-2 hover:text-[#007595]">
                    <button onClick={logout} className="w-full text-left">
                        Logout
                    </button>
                </li>

            </ul>
        </div>
    );
}

export default Sidebar;