import React from 'react'
import aura from '/assets/aura.png'
import { Link } from 'react-router';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInstagram, faFacebook, faYoutube } from "@fortawesome/free-brands-svg-icons";

function Footer() {
    const linkSections = [

        {
            title: "Quick Links",
            links: ["Home", "Contact Us","Best Sellers", "Offers & Deals", "FAQs"],
            linkes: ["/", "/contact"]

        },
        {
            title: "Need Help?",
            links: ["Delivery Information", "Return & Refund Policy", "Payment Methods", "Track your Order", "Contact Us"],
            linkes: ["/contact", "/"]
        },
        {
            title: "Follow Us",
            links: [<FontAwesomeIcon icon={faInstagram} className='text-red-400 text-sm md:text-3xl' />, 
            <FontAwesomeIcon icon={faFacebook} className='text-blue-500 text-sm md:text-3xl'
            //  size='2x'
              />, 
            <FontAwesomeIcon icon={faYoutube} className='text-red-500 text-sm md:text-3xl'/>],
            linkes: ["/", "/", "/"],
            className: "flex space-x-1 md:space-x-2"
        }
    ];
    const year = new Date().getFullYear();
    return (
        <div className="px-6 md:px-16 lg:px-24 xl:px-32 bg-gray-50">
            <div className="flex flex-col md:flex-row items-start justify-between gap-10 py-10 border-b border-gray-500/30 text-gray-500">
                <div className=''>
                    <img className="w-20 md:w-40 rounded-full mb-0" src={aura} />
                    <p className="max-w-[410px] mt-0">
                        Handcrafted jewelry made with love, creativity & timeless style — each piece tells a story.                        </p>
                </div>
                <div className="flex flex-wrap justify-between w-full md:w-[45%] gap-5">
                    {linkSections.map((section, index) => (
                        <div key={index}>
                            <h3 className="font-semibold text-base text-gray-900 md:mb-5 mb-2">
                                {section.title}
                            </h3>
                            <ul className={`text-sm ${section.className ?? ""} items-center`}>
                                {section.links.map((link, i) => (
                                    <li key={i}>
                                        <Link to={section.linkes[i]} className="hover:underline transition text-sm">
                                            {link}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
            <p className="py-4 text-center text-sm md:text-base text-gray-500/80">
                Copyright {year} © <Link to="/" className=''>Handcrafted Jewelry.</Link> All Right Reserved.
            </p>
        </div>)
}

export default Footer