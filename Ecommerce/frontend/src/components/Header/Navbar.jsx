import React, { useContext, useState, useEffect, useRef } from "react";
import { Link, NavLink } from "react-router-dom";
import shop from "/assets/ShopFusions.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart, faSearch } from "@fortawesome/free-solid-svg-icons";
import { AdminAuthContext } from "../context/AdminAuth";
import { UserAuthContext } from "../context/UserAuth";
import { VendorAuthContext } from "../context/VendorAuth";
import { CartContext } from "../context/Cart";
import { apiUrl } from "../common/Http";

function Navbar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false); 

  const debounceRef = useRef(null);

  const [open, setOpen] = useState(false);

  const { user: adminLogin, logout: adminLogout } =
    useContext(AdminAuthContext);

  const { user: userLogin, logout: userLogout } =
    useContext(UserAuthContext);

  const { user: vendorLogin, logout: vendorLogout } =
    useContext(VendorAuthContext);

  const { totalItems } = useContext(CartContext);

  const isLoggedIn = adminLogin || userLogin || vendorLogin;

  const dashboard = () => {
    if (adminLogin) return "/admin/dashboard";
    if (vendorLogin) return "/vendor/dashboard";
    return "/user/dashboard";
  };

  const handleLogout = () => {
    if (adminLogin) adminLogout();
    else if (vendorLogin) vendorLogout();
    else userLogout();
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (!value.trim()) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      try {
        setLoading(true);
        setShowDropdown(true);

        const res = await fetch(
          `${apiUrl}/products/search?query=${value}`
        );

        const data = await res.json();

        setSearchResults(data || []);
      } catch (error) {
        console.error("Search error:", error);
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    }, 400);
  };

  const handleSearchClick = async () => {
    if (!searchTerm.trim()) return;

    try {
      setLoading(true);
      setShowDropdown(true);

      const res = await fetch(
        `${apiUrl}/products/search?query=${searchTerm}`
      );

      const data = await res.json();

      setSearchResults(data || []);
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".search-box")) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <>
      {/* TOP BAR */}
      <div className="w-full bg-[#007595] h-14 flex items-center justify-center">
        <h1 className="text-xl sm:text-2xl font-semibold text-white tracking-wide">
          Discover & Shop
        </h1>
      </div>

      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-gradient-to-b from-[#f7fbfc] to-[#e9f4f6] shadow-md">

        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 md:px-10 py-3">

          {/* LOGO */}
          <Link to="/">
            <img src={shop} className="w-20 rounded-full" />
          </Link>

          {/* MENU */}
          <div className="hidden md:flex gap-8">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/shop">Shop</NavLink>
            <NavLink to="/contact">Contact</NavLink>
            {isLoggedIn && <NavLink to={dashboard()}>Dashboard</NavLink>}
          </div>

          {/* RIGHT SIDE */}
          <div className="hidden md:flex items-center gap-6">

            <div className="relative w-80 search-box">

              <div className="flex items-center bg-white border border-gray-300 rounded-full overflow-hidden shadow-sm">

                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSearchClick();
                  }}
                  placeholder="Search products..."
                  className="flex-1 px-5 py-2 text-sm outline-none bg-transparent"
                />

                <button
                  onClick={handleSearchClick}
                  className="px-5 py-2 text-white flex items-center gap-2"
                >
                  <FontAwesomeIcon icon={faSearch} />
                 
                </button>

              </div>

              {/* DROPDOWN */}
              {showDropdown && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white shadow-lg rounded-xl max-h-72 overflow-y-auto z-50 border">

                  {loading && (
                    <div className="px-4 py-3 text-sm text-gray-500">
                      Searching...
                    </div>
                  )}

                  {!loading && searchResults.length === 0 && (
                    <div className="px-4 py-3 text-sm text-gray-500">
                      No products found
                    </div>
                  )}

                  {!loading && searchResults.map((product) => (
                    <Link
                      key={product.id}
                      to={`/product/${product.id}`}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100"
                      onClick={() => {
                        setSearchTerm("");
                        setSearchResults([]);
                        setShowDropdown(false);
                      }}
                    >
                      <img
                        src={product.image}
                        className="w-10 h-10 rounded object-cover"
                      />
                      <span className="text-sm">{product.name}</span>
                    </Link>
                  ))}

                </div>
              )}
            </div>

            {/* CART */}
            <NavLink to="/cart" className="relative">
              <FontAwesomeIcon icon={faShoppingCart} />
              {totalItems() > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#007595] text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {totalItems()}
                </span>
              )}
            </NavLink>

            {/* LOGIN / LOGOUT */}
            {!isLoggedIn ? (
              <Link to="/login" className="bg-[#007595] text-white px-4 py-2 rounded">
                Login
              </Link>
            ) : (
              <button onClick={handleLogout} className="bg-[#007595] text-white px-4 py-2 rounded">
                Logout
              </button>
            )}

          </div>

          {/* MOBILE */}
          <button className="md:hidden text-3xl" onClick={() => setOpen(!open)}>
            ☰
          </button>

        </div>
      </nav>
    </>
  );
}

export default Navbar;