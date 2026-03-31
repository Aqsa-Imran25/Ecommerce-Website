import React, { useContext, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import aura from "/assets/aura.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart, faSearch } from "@fortawesome/free-solid-svg-icons";
import { AdminAuthContext } from "../context/AdminAuth";
import { UserAuthContext } from "../context/UserAuth";
import { VendorAuthContext } from "../context/VendorAuth";

import { CartContext } from "../context/Cart";
import { apiUrl } from "../common/Http";

function Navbar() {
  // serach
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);


  const [open, setOpen] = useState(false);

  const { user: adminLogin, logout: adminLogout } =
    useContext(AdminAuthContext);

  const { user: userLogin, logout: userLogout } =
    useContext(UserAuthContext);

  const { user: vendorLogin, logout: vendorLogout } =
    useContext(VendorAuthContext);

  const { totalItems } = useContext(CartContext);
  // dashboard-page
  const dashboard = () => {
    if (adminLogin) {
      return "/admin/dashboard";
    }
    else if (vendorLogin) {
      return "/vendor/dashboard";
    }
    else {
      return "/user/dashboard";
    }
  }

  const handleLogout = () => {
    if (adminLogin) adminLogout();
    else if (vendorLogin) vendorLogout();
    else userLogout();
  };

  const isLoggedIn = adminLogin || userLogin || vendorLogin;

  // search
  const handleSearch = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim().length > 0) {
      const res = await fetch(
        `${apiUrl}/products/search?query=${value}`
      );

      const data = await res.json();
      setSearchResults(data);
    } else {
      setSearchResults([]);
    }
  };

  return (
    <>
      <div className="w-full bg-[#007595] h-14 flex items-center justify-center">
        <h1 className="text-xl sm:text-2xl font-semibold text-white tracking-wide">
          Handcrafted Jewelry
        </h1>
      </div>

      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-gradient-to-b from-[#f7fbfc] to-[#e9f4f6] shadow-md">

        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 md:px-10 py-3">

          <Link to="/" className="flex items-center gap-2 group">
            <img
              src={aura}
              alt="logo"
              className="w-14 rounded-full transition duration-300 group-hover:scale-110"
            />
          </Link>

          <div className="hidden md:flex items-center gap-10 font-medium text-gray-800">

            <NavLink
              to="/"
              className={({ isActive }) =>
                `transition duration-300 ${isActive
                  ? "text-[#007595] border-b-2 border-[#007595]"
                  : "hover:text-[#007595]"
                }`
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/shop"
              className={({ isActive }) =>
                `transition duration-300 ${isActive
                  ? "text-[#007595] border-b-2 border-[#007595]"
                  : "hover:text-[#007595]"
                }`
              }
            >
              Shop
            </NavLink>

            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `transition duration-300 ${isActive
                  ? "text-[#007595] border-b-2 border-[#007595]"
                  : "hover:text-[#007595]"
                }`
              }
            >
              Contact
            </NavLink>
            {
              isLoggedIn &&
              <NavLink
                to={dashboard()}
                className={({ isActive }) =>
                  `transition duration-300 ${isActive
                    ? "text-[#007595] border-b-2 border-[#007595]"
                    : "hover:text-[#007595]"
                  }`
                }
              >
                Dashboard
              </NavLink>

            }

          </div>

          <div className="hidden md:flex items-center gap-6">

            <div className="relative flex items-center">

              <input
                type="text"
                placeholder="Search jewelry..."
                value={searchTerm}
                onChange={handleSearch}
                className="..."
              />
              {searchResults.length > 0 && (
                <div className="search-results text-gray-700 hover:text-[#007595] transition duration-300 hover:scale-110">
                  {searchResults.map((product) => (
                    <Link to={`/product/${product.id}`} key={product.id}>
                      <div className="p-2">
                        {product.name}
                        <FontAwesomeIcon icon={faSearch} />
                      </div>
                    </Link>
                  ))}
                </div>
              )}

            </div>

            <NavLink to="/cart" className="relative group">

              <FontAwesomeIcon
                icon={faShoppingCart}
                className="text-xl text-gray-700 transition duration-300 group-hover:scale-110 group-hover:text-[#007595]"
              />

              {totalItems() > 0 && (
                <span className="absolute -top-2 -right-3 bg-[#007595] text-white text-xs w-5 h-5 flex items-center justify-center rounded-full animate-pulse">
                  {totalItems()}
                </span>
              )}

            </NavLink>

            {!isLoggedIn ? (
              <Link
                to="/login"
                className="px-5 py-2 rounded-full bg-[#007595] text-white shadow-md
                hover:bg-[#004f64] hover:scale-105 transition duration-300"
              >
                Login
              </Link>
            ) : (
              <button
                onClick={handleLogout}
                className="px-5 py-2 rounded-full bg-[#007595] text-white shadow-md
                hover:bg-[#004f64] hover:scale-105 transition duration-300"
              >
                Logout
              </button>
            )}

          </div>

          <button
            className="md:hidden text-3xl text-[#007595]"
            onClick={() => setOpen(!open)}
          >
            ☰
          </button>

        </div>

        <div
          className={`md:hidden overflow-hidden transition-all duration-500 ${open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            }`}
        >

          <div className="px-6 py-6 bg-gradient-to-b from-[#f7fbfc] to-[#e9f4f6] space-y-4 text-gray-700">

            <input
              type="text"
              placeholder="Search jewelry..."
              className="w-full border border-gray-200 rounded-full px-4 py-2 text-sm outline-none"
            />

            <NavLink className="block hover:text-[#007595]" to="/">
              Home
            </NavLink>

            <NavLink className="block hover:text-[#007595]" to="/shop">
              Shop
            </NavLink>

            <NavLink className="block hover:text-[#007595]" to="/contact">
              Contact
            </NavLink>

            {
              isLoggedIn &&
              <NavLink
                className="block hover:text-[#007595]"
                to={dashboard}
              >
                Dashboard
              </NavLink>

            }


          </div>

        </div>

      </nav>
    </>
  );
}

export default Navbar;