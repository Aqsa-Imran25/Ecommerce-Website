import React, { useContext } from 'react'
import { Link } from 'react-router-dom';
import { VendorAuthContext } from '../context/VendorAuth';

function SidebarVendor() {
    const { logout } = useContext(VendorAuthContext);

    const sideBarLinks = [
        { name: "Dashboard", path: "/user/dashboard" },
        { name: "Products", path: "/myproducts" },
        { name: "My Account", path: "/myaccount" },
        { name: "Order", path: "/myorder" },
        { name: "Products", path: "/products/create" },
    ]
    return (

        <div className='shadow-lg p-4 rounded-lg border-2 border-gray-200'>
            <ul className='px-5'>
                {
                    sideBarLinks.map(links => (
                        <li key={links.path} className='text-black py-2 border-b-2 border-gray-100 hover:text-[#007595]'>
                            <Link to={links.path}>{links.name}</Link>
                        </li>

                    ))
                }
                <li className="text-black py-2 hover:text-[#007595]">
                    <button onClick={logout} className="w-full text-left">
                        Logout
                    </button>
                </li>
            </ul>
        </div>
    )
}

export default SidebarVendor