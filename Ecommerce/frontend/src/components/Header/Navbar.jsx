import React, { useContext, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import aura from "/assets/aura.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { AdminAuthContext } from "../context/AdminAuth";
import { UserAuthContext } from "../context/UserAuth";
import { CartContext } from "../context/Cart";

function Navbar() {
  const [open, setOpen] = useState(false);
  const { user: adminLogin, logout: adminLogout } =
    useContext(AdminAuthContext);
  const { user: userLogin, logout: userLogout } = useContext(UserAuthContext);
  const { cartData, totalItems, } = useContext(CartContext);



  const handleLogout = () => {
    if (adminLogin) adminLogout();
    else if (userLogin) userLogout();
  };

  const isLoggedIn = adminLogin || userLogin;

  return (
    <>
      <div className="w-full bg-[#007595] h-14 sm:h-16 flex items-center justify-center">
        <h1 className="text-xl sm:text-2xl font-bold text-white">
          Handcrafted Jewelry
        </h1>
      </div>

      <nav className="sticky top-0 z-50 bg-gray-50 shadow-md">
        <div className="flex items-center justify-between px-6 md:px-16 py-4">



          <NavLink to="/">
            <img src={aura} alt="logo" className="w-20 rounded-full" />
          </NavLink>

          <div className="hidden sm:flex gap-8 items-center">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive
                  ? "text-[#007595] font-semibold border-b-2 border-[#007595]"
                  : "text-gray-700 hover:text-[#007595]"
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/shop"
              className={({ isActive }) =>
                isActive
                  ? "text-[#007595] font-semibold border-b-2 border-[#007595]"
                  : "text-gray-700 hover:text-[#007595]"
              }
            >
              Shop
            </NavLink>

            <NavLink
              to="/contact"
              className={({ isActive }) =>
                isActive
                  ? "text-[#007595] font-semibold border-b-2 border-[#007595]"
                  : "text-gray-700 hover:text-[#007595]"
              }
            >
              Contact
            </NavLink>
            <NavLink
              to="/cart"
              className={({ isActive }) =>
                `relative flex items-center ${isActive
                  ? "text-[#007595] font-semibold border-b-2 border-[#007595]"
                  : "text-gray-700 hover:text-[#007595]"
                }`
              }
            >
              <FontAwesomeIcon icon={faShoppingCart} className="text-lg" />

              {totalItems() > 0 && (
                <span className="absolute -top-2 -right-2 
      sm:-right-3 
      flex items-center justify-center 
      min-w-[18px] h-[18px] 
      text-[10px] sm:text-xs 
      font-bold 
      text-white 
      bg-red-600 
      rounded-full">
                  {totalItems()}
                </span>
              )}
            </NavLink>

            {!isLoggedIn ? (
              <Link
                to="/login"
                className="px-4 py-2 rounded-full bg-[#007595] text-white hover:bg-slate-900 hover:scale-[1.02]"
              >
                Login
              </Link>
            ) : (
              <button
                onClick={handleLogout}
                className="cursor-pointer px-6 py-2 rounded-full bg-[#007595] text-white hover:bg-slate-900 hover:scale-[1.02]"
              >
                Logout
              </button>
            )}
          </div>

          <button className="sm:hidden text-2xl" onClick={() => setOpen(!open)}>
            ☰
          </button>
        </div>

        {open && (
          <div className="sm:hidden bg-white shadow px-6 py-4">
            <NavLink className="block py-2" to="/">
              Home
            </NavLink>
            <NavLink className="block py-2" to="/shop">
              Shop
            </NavLink>
            <NavLink className="block py-2" to="/contact">
              Contact
            </NavLink>
            <NavLink className="py-2 relative" to="/cart">
              <FontAwesomeIcon icon={faShoppingCart} size="1x" />
              {totalItems() > 0 && (
                <span className="absolute -top-1 -right-2 
    flex items-center justify-center 
    min-w-[16px] h-[16px] 
    text-[9px] 
    font-bold 
    text-white 
    bg-red-600 
    rounded-full">
                  {totalItems()}
                </span>
              )}
            </NavLink>

            {!isLoggedIn ? (
              <NavLink className="block py-2" to="/login">
                Login
              </NavLink>
            ) : (
              <NavLink className="block py-2" onClick={handleLogout}>
                Logout
              </NavLink>
            )}
          </div>
        )}
      </nav>
    </>
  );
}

export default Navbar;
