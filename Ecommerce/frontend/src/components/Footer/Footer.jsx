import React from "react";
import aura from "/assets/aura.png";
import { FaFacebookF, FaInstagram, FaTwitter, FaPinterestP } from "react-icons/fa";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-gradient-to-b from-[#f7fbfc] to-[#e9f4f6] text-gray-700">

      <div className="max-w-7xl mx-auto px-6 md:px-10 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

        <div className="space-y-4">
          <img src={aura} alt="logo" className="w-16 rounded-full" />

          <h3 className="text-xl font-semibold text-[#007595]">
            Artisan Aura
          </h3>

          <p className="text-sm leading-relaxed text-gray-600">
            Handcrafted jewelry designed with passion and precision.
            Every piece reflects elegance, craftsmanship, and timeless beauty.
          </p>

          <div className="flex gap-4 pt-2">

            <a className="p-2 rounded-full bg-white shadow hover:bg-[#007595] hover:text-white transition duration-300 hover:scale-110">
              <FaFacebookF />
            </a>

            <a className="p-2 rounded-full bg-white shadow hover:bg-[#007595] hover:text-white transition duration-300 hover:scale-110">
              <FaInstagram />
            </a>

            <a className="p-2 rounded-full bg-white shadow hover:bg-[#007595] hover:text-white transition duration-300 hover:scale-110">
              <FaTwitter />
            </a>

            <a className="p-2 rounded-full bg-white shadow hover:bg-[#007595] hover:text-white transition duration-300 hover:scale-110">
              <FaPinterestP />
            </a>

          </div>
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-4 text-gray-900">
            Quick Links
          </h4>

          <ul className="space-y-3 text-sm">

            <li>
              <Link className="hover:text-[#007595] transition duration-300">
                Home
              </Link>
            </li>

            <li>
              <Link className="hover:text-[#007595] transition duration-300">
                Shop
              </Link>
            </li>

            <li>
              <Link className="hover:text-[#007595] transition duration-300">
                New Arrivals
              </Link>
            </li>

            <li>
              <Link className="hover:text-[#007595] transition duration-300">
                Contact
              </Link>
            </li>

          </ul>
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-4 text-gray-900">
            Support
          </h4>

          <ul className="space-y-3 text-sm">

            <li>
              <Link className="hover:text-[#007595] transition duration-300">
                FAQ
              </Link>
            </li>

            <li>
              <Link className="hover:text-[#007595] transition duration-300">
                Shipping & Returns
              </Link>
            </li>

            <li>
              <Link className="hover:text-[#007595] transition duration-300">
                Privacy Policy
              </Link>
            </li>

            <li>
              <Link className="hover:text-[#007595] transition duration-300">
                Terms & Conditions
              </Link>
            </li>

          </ul>
        </div>

        <div>

          <h4 className="text-lg font-semibold mb-4 text-gray-900">
            Join Our Jewelry Lovers List
          </h4>

          <p className="text-sm text-gray-600 mb-4">
            Subscribe to receive exclusive offers and new handcrafted collections.
          </p>

          <div className="flex items-center bg-white rounded-full shadow overflow-hidden">

            <input
              type="email"
              placeholder="Your email"
              className="px-4 py-2 text-sm w-full outline-none"
            />

            <button className="px-4 py-2 bg-[#007595] text-white text-sm hover:bg-[#004f64] transition duration-300">
              Join
            </button>

          </div>

        </div>

      </div>

      <div className="border-t border-gray-200">

        <div className="max-w-7xl mx-auto px-6 md:px-10 py-6 flex flex-col md:flex-row items-center justify-between text-sm text-gray-500">

          <p>
            © {new Date().getFullYear()} Artisan Aura. All rights reserved.
          </p>

          <div className="flex gap-6 mt-3 md:mt-0">

            <Link className="hover:text-[#007595] transition">
              Privacy
            </Link>

            <Link className="hover:text-[#007595] transition">
              Terms
            </Link>

            <Link className="hover:text-[#007595] transition">
              Sitemap
            </Link>

          </div>

        </div>

      </div>

    </footer>
  );
}

export default Footer;